import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import { useSession } from 'next-auth/client'

export default function Navigation() {
  // const [session, loading] = useSession()
  const router = useRouter()

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand onClick={() => router.push('/')}>Home</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
            <>
              <Link href="/">
                <div className={`${router.asPath === '/' && 'active'} nav-link`}>
                  Charts
                </div>
              </Link>
              <Link href="/about">
                <div className={`${router.asPath === '/about' && 'active'} nav-link`}>
                  About
                </div>
              </Link>
              {/* <Link href="/auth/logout">
                <div
                  className={`${
                    router.asPath === '/auth/logout' && 'active'
                  } nav-link`}
                >
                  Logout
                </div>
              </Link> */}
            <Link href="/auth/login">
              <div
                className={`${
                  router.asPath === '/auth/login' && 'active'
                } nav-link`}
              >
                Login
              </div>
            </Link>
          </>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}