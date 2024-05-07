import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import PokemonList from './PokemonList';
import PokemonDetail from './PokemonDetail';
import PokemonQuiz from './PokemonQuiz';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './Homepage';
import TeamBuilder from './TeamBuilder';

function App() {
    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/home">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/pokemon">Pokédex</Nav.Link>
                            <Nav.Link as={Link} to="/quiz">Pokémon Quiz</Nav.Link>
                            <Nav.Link as={Link} to="/team">Pokémon Team Builder</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/pokemon" element={<PokemonList />} />
                    <Route path="/pokemon/:number" element={<PokemonDetail />} />
                    <Route path="/quiz" element={<PokemonQuiz />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/team" element={<TeamBuilder />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
