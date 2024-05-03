import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const typeColors = {
    Grass: '#78C850',
    Poison: '#A040A0',
    Fire: '#F08030',
    Water: '#6890F0',
    Electric: '#F8D030',
    Ice: '#98D8D8',
    Fighting: '#C03028',
    Ground: '#E0C068',
    Psychic: '#F85888',
    Rock: '#B8A038',
    Dark: '#705848',
    Steel: '#B8B8D0',
    Fairy: '#EE99AC',
    Normal: '#A8A878',
    Bug: '#A8B820',
    Ghost: '#705898',
    Dragon: '#7038F8',
    Flying: '#A890F0'
};

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://fsd-backend-final-wdw2117-4971c9511ab0.herokuapp.com/pokemon')
        .then(response => response.json())
        .then(data => {
            setPokemons(data);
            setFilteredPokemons(data);
        })
        .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const results = pokemons.filter(pokemon =>
        pokemon.Pokemon.toLowerCase().includes(search.toLowerCase()) ||
        pokemon.Type1.toLowerCase().includes(search.toLowerCase()) ||
        (pokemon.Type2 && pokemon.Type2.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredPokemons(results);
  }, [search, pokemons]);

  const handleCardClick = (number) => {
    navigate(`/pokemon/${number}`);
  };

  return (
    <Container fluid>
        <h1 style={{fontWeight: 'bold', fontSize: '96px'}} className="text-center mt-4 mb-4">Original 151</h1>
        <Form className="mt-3 mb-3"> 
            <Form.Group controlId="formSearchPokemon">
                <Form.Control
                    type="text"
                    placeholder="Search by name or type"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Form.Group>
        </Form>
        <Row xs={1} sm={2} md={4} lg={6}>
            {filteredPokemons.map(pokemon => (
                <Col key={pokemon._id} className="mt-4">
                    <Card className="h-100 d-flex flex-column" onClick={() => handleCardClick(pokemon.Number)} style={{ cursor: 'pointer' }}>
                        <Card.Body className="flex-grow-1 d-flex flex-column">
                            <div className="mb-auto text-center">
                                <Card.Title>{pokemon.Pokemon}</Card.Title>
                                <div>
                                    <span style={{ color: typeColors[pokemon.Type1], marginRight: '10px' }}>
                                        {pokemon.Type1}
                                    </span>
                                    {pokemon.Type2 && 
                                        <span style={{ color: typeColors[pokemon.Type2] }}>
                                            {pokemon.Type2}
                                        </span>}
                                </div>
                            </div>
                            <div className="mt-auto">
                                <img src={pokemon.GIF} alt={pokemon.Pokemon} style={{ width: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>
  );
}

export default PokemonList;
