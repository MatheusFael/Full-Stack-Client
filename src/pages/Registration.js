import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from 'axios';


export default function Registration() {


    const initialValues = {
        username: "",
        password: "",
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(6).max(20).required(),
    })

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then((response) => {
            console.log(response)
        })
    }

    return (
        <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} >
                <Form className='formContainer'>
                    
                    <label>Username:</label>
                    <ErrorMessage name="username" component="span" />
                    <Field id="inputCreatePost" autocomplete="off" name="username" placeholder="(Ex: John..)" />

                    <label>Password:</label>
                    <ErrorMessage name="password" component="span" />
                    <Field id="inputCreatePost" autocomplete="off" name="password" type="password" placeholder="(Ex: Password..)" />


                    <button type="submit"> Register</button>
                </Form>
            </Formik>
        </div>
    )
}
