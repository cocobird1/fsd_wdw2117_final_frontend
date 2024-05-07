import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const typeColors = {
    Grass: '#78C850', Poison: '#A040A0', Fire: '#F08030', Water: '#6890F0',
    Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Ground: '#E0C068',
    Psychic: '#F85888', Rock: '#B8A038', Dark: '#705848', Steel: '#B8B8D0',
    Fairy: '#EE99AC', Normal: '#A8A878', Bug: '#A8B820', Ghost: '#705898',
    Dragon: '#7038F8', Flying: '#A890F0'
};

const typeEffectiveness = {
    Normal: { Ghost: 0, Rock: 0.5, Steel: 0.5 },
    Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
    Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
    Electric: { Water: 2, Flying: 2, Ground: 0, Electric: 0.5, Grass: 0.5, Dragon: 0.5 },
    Grass: { Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
    Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
    Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5 },
    Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
    Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
    Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
    Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
    Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
    Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
    Ghost: { Psychic: 2, Ghost: 2, Normal: 0, Dark: 0.5 },
    Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
    Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
    Steel: { Ice: 2, Rock: 2, Fairy: 2, Steel: 0.5, Fire: 0.5, Water: 0.5, Electric: 0.5 },
    Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Poison: 0.5, Steel: 0.5, Fire: 0.5 }
};

function TeamBuilder() {
    const [allPokemons, setAllPokemons] = useState([]);
    const [team, setTeam] = useState([]);
    const [strengths, setStrengths] = useState({});
    const [weaknesses, setWeaknesses] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://fsd-backend-final-wdw2117-4971c9511ab0.herokuapp.com/pokemon')
            .then(response => response.json())
            .then(data => {
                setAllPokemons(data);
                setFilteredPokemons(data);
            })
            .catch(error => console.error('Error fetching Pokemon data:', error));
    }, []);

    useEffect(() => {
      const filtered = allPokemons.filter(pokemon =>
          pokemon.Pokemon.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pokemon.Type1 && pokemon.Type1.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pokemon.Type2 && pokemon.Type2.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPokemons(filtered);
    }, [searchTerm, allPokemons]);  

    useEffect(() => {
        if (team.length > 0) {
            const { strengths, weaknesses } = calculateTypeAttributes(team);
            setStrengths(strengths);
            setWeaknesses(weaknesses);
        }
    }, [team]);
  

    const removeFromTeam = (pokemon) => {
        const newTeam = team.filter(item => item._id !== pokemon._id);
        setTeam(newTeam);
        if (newTeam.length > 0) {
            const { strengths, weaknesses } = calculateTypeAttributes(newTeam);
            setStrengths(strengths);
            setWeaknesses(weaknesses);
        } else {
            setStrengths({});
            setWeaknesses({});
        }
    };

    function calculateTypeAttributes(team) {
        let strengths = {};
        let weaknesses = {};
        team.forEach(pokemon => {
            const types = [pokemon.Type1, pokemon.Type2].filter(type => type);

            types.forEach(type => {
                const effectiveness = typeEffectiveness[type];
                if (effectiveness) {
                    for (let targetType in effectiveness) {
                        if (effectiveness[targetType] > 1) {
                            strengths[targetType] = (strengths[targetType] || 0) + effectiveness[targetType];
                        } else if (effectiveness[targetType] < 1 && effectiveness[targetType] > 0) {
                            weaknesses[targetType] = (weaknesses[targetType] || 0) + effectiveness[targetType];
                        }
                    }
                }
            });
        });
        return { strengths, weaknesses };
    }

    const addToTeam = (pokemon) => {
        if (team.length < 6 && !team.some(p => p._id === pokemon._id)) {
            setTeam([...team, pokemon]);
        } else {
            alert("Your team is full or the Pokémon is already in your team!");
        }
    };
  
    return (
        <Container>
            <Row>
                <Col md={8}>
                        <h2 style={{ marginTop: '20px' }}>Select Pokémon for Your Team</h2>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or type"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <Row xs={1} md={2} lg={4} className="g-4">
                            {filteredPokemons.map(pokemon => (
                                <Col key={pokemon.id}>
                                    <Card className="h-100">
                                        <Card.Img variant="top" src={pokemon.PNG} style={{ height: '160px', objectFit: 'cover' }} />
                                        <Card.Body>
                                            <Card.Title>{pokemon.Pokemon}</Card.Title>
                                            <Button variant="primary" onClick={() => addToTeam(pokemon)}>
                                                Add to Team
                                            </Button>
                                            <Button 
                                                variant="info" 
                                                style={{ marginTop: '10px' }} 
                                                onClick={() => navigate(`/pokemon/${pokemon.Number}`)}>
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                <Col md={4}>
                      <h2 style={{ marginTop: '20px' }}>Your Team</h2>
                      {team.length > 0 ? (
                          team.map(pokemon => (
                              <Card key={pokemon.id} className="mb-3">
                                  <Card.Img variant="top" src={pokemon.GIF} style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', marginTop: '20px'}} />
                                  <Card.Body>
                                      <Card.Title>{pokemon.Pokemon}</Card.Title>
                                      <Button variant="danger" onClick={() => removeFromTeam(pokemon)}>
                                          Remove
                                      </Button>
                                  </Card.Body>
                              </Card>
                          ))
                      ) : (
                          <div style={{ marginTop: '20px', color: 'grey' }}>No Pokémon yet.</div>
                      )}

                      {team.length > 0 && (
                          <>
                              <h2>Team Strengths</h2>
                              <ul style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0' }}>
                                  {Object.keys(strengths).map(type => (
                                      <li key={type} style={{ width: '80px', backgroundColor: typeColors[type], color: '#fff', padding: '10px', borderRadius: '5px', margin: '5px', listStyleType: 'none', textAlign: 'center' }}>
                                          {type}
                                      </li>
                                  ))}
                              </ul>
                              <h2>Team Weaknesses</h2>
                              <ul style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0' }}>
                                  {Object.keys(weaknesses).map(type => (
                                      <li key={type} style={{ width: '80px', backgroundColor: typeColors[type], color: '#fff', padding: '10px', borderRadius: '5px', margin: '5px', listStyleType: 'none', textAlign: 'center' }}>
                                          {type}
                                      </li>
                                  ))}
                              </ul>
                          </>
                      )}
                  </Col>                
              </Row>
        </Container>
    );
}

export default TeamBuilder;
