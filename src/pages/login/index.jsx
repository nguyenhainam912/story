import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { callLogin } from '../../service/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlide';

const LoginPage = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)

  const dispatch = useDispatch()

  const onFinish = async (values) => {
    const {username, password} = values;
    setIsSubmit(true)
    const res = await callLogin(username, password);
    setIsSubmit(false)
    if(res?.data) {
      localStorage.setItem('access_token', res.data.access_token)
      dispatch(doLoginAction(res.data.user))
      message.success('Login success')
      navigate('/')
    }else {
      notification.error({
        message: "Error",
        description: res.message && Array.isArray(res.message) ? res.message : 'error',
        duration: 5
      })
      
    }
    
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  
    return( 
     <>
     <h4 >Login</h4>
          
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
                label="Email"
                name="username"
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
export default LoginPage;