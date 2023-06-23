import React, { useState } from 'react';
import styles from './register.module.scss';
import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { callRegister } from '../../service/api';

const RegisterPage = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)

  const onFinish = async (values) => {
    const {fullName, email, password, phone} = values;
    setIsSubmit(true)
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false)
    if(res?.data?._id) {
      message.success('Register success')
      navigate('/login')
    }else {
      notification.error({
        message: "Error",
        description: res.message && res.message.length > 0 ? res.message[0] : 'error',
        duration: 5
      })
      
    }
    
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  
    return( 
     <>
     <h4 className={styles.header}>Register</h4>
          
    <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Full name"
                name="fullName"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input />
              </Form.Item>
      
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input />
              </Form.Item>
          
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
      
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
              >
                <Input />
              </Form.Item>
          
              <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
          
              <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Submit
                </Button>
              </Form.Item>
    </Form>
        
     </>
    )
}


export default RegisterPage;