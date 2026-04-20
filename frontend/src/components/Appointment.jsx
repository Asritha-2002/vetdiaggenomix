import React from 'react'
import Navbar from '../pages/Navbar'
import BookAppointment from '../pages/BookAppointment'
import Footer from '../pages/Footer'

const Appointment = () => {
  return (
    <div>
        <Navbar/>
        <div className='mt-16 lg:mt-20'>
            <BookAppointment/>
        </div>
        <Footer/>
    </div>
  )
}

export default Appointment