import { Container, Row, Col, Card } from 'react-bootstrap';

function HomePage() {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <h1>Welcome to the Original 151 Pokémon Tracker!</h1>
                    <p>Explore the world of Pokémon, then test your Pokémon knowledge with our quiz!</p>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
