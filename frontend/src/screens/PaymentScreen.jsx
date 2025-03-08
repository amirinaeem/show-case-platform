import { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { saveBillingAddress } from '../slices/cartSlice';

function PaymentScreen() {
    const cart = useSelector((state) => state.cart);
    const { billingAddress } = cart; 

    const [address, setAddress] = useState(billingAddress?.address || '');
    const [city, setCity] = useState(billingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(billingAddress?.postalCode || '');
    const [country, setCountry] = useState(billingAddress?.country || '');

    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveBillingAddress({ address, city, postalCode, country }));
        navigate('/checkout'); 
    };

    return (
        <FormContainer>
            <h1>Payment Process</h1>
            <Form onSubmit={submitHandler}>
                {/* Address Field */}
                <Form.Group controlId="address" className="my-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* City Field */}
                <Form.Group controlId="city" className="my-2">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Postal Code Field */}
                <Form.Group controlId="postalCode" className="my-2">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Country Field */}
                <Form.Group controlId="country" className="my-2">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button type="submit" variant="primary" className="my-3">
                    Continue to Payment
                </Button>
            </Form>
        </FormContainer>
    );
}

export default PaymentScreen;