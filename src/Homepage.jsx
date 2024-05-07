import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h1>Welcome to the Original 151 Pokémon Tracker!</h1>
                    <p>Explore the world of Pokémon, then test your Pokémon knowledge with our quiz, or build your dream team!</p>
                    <div className="mt-4">
                        <Button variant="primary" onClick={() => navigate('/pokemon')} className="mx-2">Go to Pokédex</Button>
                        <Button variant="success" onClick={() => navigate('/quiz')} className="mx-2">Take the Quiz</Button>
                        <Button variant="warning" onClick={() => navigate('/team')} className="mx-2">Team Builder</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
