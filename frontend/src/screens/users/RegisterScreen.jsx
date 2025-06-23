import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from "../../components/application/FormContainer";
import Loader from '../../components/helpers/Loader';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarUrl: '', // store URL returned from upload
  });

  const [imagePreview, setImagePreview] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadAvatarHandler = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/uploads/avatar', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Avatar upload failed');

    toast.success('Avatar uploaded successfully');
    setFormData((prev) => ({ ...prev, avatarUrl: data.url }));
    return data.url; 
  } catch (error) {
    toast.error(error.message);
    throw error; 
  }
};

  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Show preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      // Upload to server
      await uploadAvatarHandler(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatarUrl,
      }).unwrap();

      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <h1 className="text-center mb-4">Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            required
          />
        </Form.Group>

        <Form.Group controlId="profileImage" className="mb-4">
          <Form.Label>Profile Image</Form.Label>
          <div className="d-flex align-items-center gap-3">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="rounded-circle"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  border: '2px solid #dee2e6',
                }}
              />
            )}
            <div className="flex-grow-1">
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Optional: Upload a profile picture
              </Form.Text>
            </div>
          </div>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="w-100 py-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader size="sm" /> : 'Register'}
        </Button>
      </Form>

      <Row className="mt-3 text-center">
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
