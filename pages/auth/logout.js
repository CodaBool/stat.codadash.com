/* This may be better suited to be a modal which the user can interact with on any page */
import React from 'react'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { signOut, useSession } from 'next-auth/react'
import { Load, isLoad } from '../../components/Load'

export default function Logout() {
  const { data: session, status } = useSession()

  if (isLoad(session, status, true)) return <Load />

  return (
    <>
      <h1 className="display-4 text-center my-5">
        Are you sure you would like to Logout?
      </h1>
      <Row>
        <Button
          className="mx-auto my-5"
          style={{ width: '80%' }}
          variant="warning"
          type="submit"
          onClick={() => {
            signOut({ callbackUrl: '/' })
          }}
        >
          Logout
        </Button>
      </Row>
    </>
  )
}
