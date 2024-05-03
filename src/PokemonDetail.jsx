import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, ListGroupItem, ProgressBar, Button } from 'react-bootstrap';

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

function PokemonDetail() {
  const { number } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`https://fsd-backend-final-wdw2117-4971c9511ab0.herokuapp.com/pokemon/${number}`)
      .then(response => response.json())
      .then(data => setPokemon(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [number]);

  const handleNext = () => {
    const nextIndex = pokemon.Number + 1;
    if (nextIndex < 152) {
      navigate(`/pokemon/${nextIndex}`);
    }
  };

  const handleBack = () =>{
    const nextIndex = pokemon.Number - 1;
    if(nextIndex > 0){
      navigate(`/pokemon/${nextIndex}`);
    }
  }
  
  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Card.Img variant="top" src={pokemon.GIF} alt={pokemon.Pokemon} style={{ maxHeight: '120px', width: '100%', objectFit: 'contain' }} />
                </Col>
                <Col md={8}>
                  <Card.Title>{pokemon.Pokemon}</Card.Title>
                  <Card.Text>{pokemon.Description}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem style={{ backgroundColor: typeColors[pokemon.Type1], color: 'white' }}>
                {pokemon.Type1}
              </ListGroupItem>
              {pokemon.Type2 && (
                <ListGroupItem style={{ backgroundColor: typeColors[pokemon.Type2], color: 'white' }}>
                  {pokemon.Type2}
                </ListGroupItem>
              )}
              {['HP', 'Attack', 'Defense', 'Speed', 'Special'].map(stat => (
                <ListGroupItem key={stat}>
                  {stat}: {pokemon[stat]}
                  <ProgressBar now={pokemon[stat]} max={100} label={`${pokemon[stat]}`} />
                </ListGroupItem>
              ))}
            </ListGroup>
            
          </Card>
          <Row style={{marginTop: "20px"}} className="justify-content-center">
            <Col md={2} className="d-flex justify-content-end">
              <Button variant="primary" onClick={handleBack}>Back</Button>
            </Col>
            <Col md={2} className="d-flex justify-content-start">
              <Button variant="primary" onClick={handleNext}>Next</Button>
            </Col>
          </Row>
          
        </Col>
      </Row>
    </Container>
  );
}

export default PokemonDetail;
