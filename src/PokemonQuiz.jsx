import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';

const typeColors = {
    Grass: '#78C850', Poison: '#A040A0', Fire: '#F08030', Water: '#6890F0',
    Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Ground: '#E0C068',
    Psychic: '#F85888', Rock: '#B8A038', Dark: '#705848', Steel: '#B8B8D0',
    Fairy: '#EE99AC', Normal: '#A8A878', Bug: '#A8B820', Ghost: '#705898',
    Dragon: '#7038F8', Flying: '#A890F0'
};

function PokemonQuiz() {
    const [pokemons, setPokemons] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [options, setOptions] = useState([]);
    const [answerFeedback, setAnswerFeedback] = useState({show: false, correct: false, gif: '', pokemon: ''});

    useEffect(() => {
        fetch('https://fsd-backend-final-wdw2117-4971c9511ab0.herokuapp.com/pokemon')
            .then(response => response.json())
            .then(data => {
                setPokemons(data);
                setNextQuestion(data);
            })
            .catch(error => console.error('Error fetching Pokemon data:', error));
    }, []);

    const setNextQuestion = (data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const questionPokemon = data[randomIndex];
        setCurrentQuestion(questionPokemon);
        generateOptions(questionPokemon, data);
    };

    const generateOptions = (questionPokemon, data) => {
        let optionsSet = new Set();
        optionsSet.add(questionPokemon);

        while (optionsSet.size < 4) {
            const randomOption = data[Math.floor(Math.random() * data.length)];
            optionsSet.add(randomOption);
        }

        const optionsArray = Array.from(optionsSet);
        shuffleArray(optionsArray);
        setOptions(optionsArray);
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const handleOptionClick = (option) => {
        setTotalQuestions(totalQuestions + 1);
        if (option.Pokemon === currentQuestion.Pokemon) {
            setScore(score + 1);
            setAnswerFeedback({show: true, correct: true, gif: currentQuestion.GIF, pokemon: currentQuestion.Pokemon});
        } else {
            setAnswerFeedback({show: true, correct: false, gif: currentQuestion.GIF, pokemon: currentQuestion.Pokemon});
        }
        setTimeout(() => {
            setAnswerFeedback({show: false, correct: false, gif: '', pokemon: currentQuestion.Pokemon});
            setNextQuestion(pokemons);
        }, 2000);
    };

    const getPercentage = () => {
        return totalQuestions > 0 ? (score / totalQuestions * 100).toFixed(0) : 0;
    };

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Who's That Pokémon?</Card.Title>
                            <Card.Text>Description: {currentQuestion.Description}</Card.Text>
                            <div>
                                {options.map((option, index) => (
                                    <Button key={index}
                                        variant="outline-primary"
                                        style={{ backgroundColor: typeColors[option.Type1], color: 'white', margin: '10px' }}
                                        onClick={() => handleOptionClick(option)}>
                                        {option.Pokemon}
                                    </Button>
                                ))}
                            </div>
                            {answerFeedback.show && (
                                <div className="text-center mt-3">
                                    <img src={answerFeedback.gif} alt="Current Pokemon" style={{ maxWidth: '100px' }} />
                                    <p><b>{answerFeedback.pokemon}</b></p>
                                    <h5>{answerFeedback.correct ? 'Correct!' : 'Wrong!'}</h5>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                    <div className="mt-3 text-center">
                        <h4>Score: {score}/{totalQuestions} ({getPercentage()}%)</h4>
                        <ProgressBar now={getPercentage()} label={`${getPercentage()}%`} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default PokemonQuiz;
