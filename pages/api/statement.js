import { Statement } from '../../models'
import applyMiddleware, { jwtFromReqOrCtx } from '../../util'
import { User } from '../../models'

export default applyMiddleware(async (req, res) => {
  try {
    const { method, body, query } = req
    if (method === 'POST') {
      const jwt = jwtFromReqOrCtx(req)
      const user = await User.findOne({ email: jwt.email.toLowerCase() })
      if (!user) throw `Could Not find ${jwt.email}`
      const statement = await Statement.create({ user: user.id, alias: user.alias, description: body.description, amount: Number(body.amount)})
        .catch(err => {throw err._message})
      res.status(200).json(statement)
    } else if (method === 'GET') {
      const agg = await getAgg()
        .then(res => res)
        .catch(err => {throw err})
      res.status(200).json(agg[0])
    } else if (method === 'DELETE') {
      const jwt = jwtFromReqOrCtx(req)
      const user = await User.findOne({ email: jwt.email.toLowerCase() })
      if (!user.admin) throw 'Unathorized'
      const statement = await Statement.deleteOne({ _id: query.id })
        .catch(err => {throw err._message})
      res.status(200).json(statement)
    } else {
      throw `Cannot use ${method} method for this route`
    }
  } catch (err) {
    console.log('outter', err)
    if (typeof err === 'string') {
      res.status(400).json({ msg: '/statement: ' + err })
    } else {
      res.status(500).json({ msg: '/statement: ' + (err.message || err)})
    }
  }
})

function getAgg() {
  return Statement.aggregate([
    {
      "$facet": {
        "bar": [
          {
            $group: {
              _id: {
                id: "$_id",
                alias: "$alias",
                month: {
                  $month: {
                    date: "$createdAt"
                  }
                },
                year: {
                  $year: {
                    date: "$createdAt"
                  }
                },
                createdAt: "$createdAt"
              },
              total: {
                $sum: "$amount"
              }
            }
          },
          {
            $group: {
              _id: {
                alias: "$_id.alias",
                year: "$_id.year",
                month: "$_id.month",
                
              },
              total: {
                $sum: "$total"
              },
              
            }
          },
          {
            $set: {
              month: "$_id.month",
              year: "$_id.year",
              alias: "$_id.alias"
            }
          },
          {
            $sort: {
              year: 1,
              month: 1
            }
          }
        ],
        "raw": [
          {
            $match: {}
          }
        ],
        "doughnut": [
          {
            $group: {
              _id: {
                alias: "$alias"
              },
              total: {
                $sum: "$amount"
              }
            }
          },
          {
            $set: {
              alias: "$_id.alias"
            }
          }
        ]
      }
    }
  ])
}