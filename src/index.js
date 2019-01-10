import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Questions souleve par cet exercise:

// Dans le tutorial on mentionne a la fin d'une section:
//
// When you call setState in a component, React automatically updates the child components inside of it too.
//
// CA merite plus d'explications



// class Square extends React.Component {

//     render() {
//         return (
//             <button className="square"
//                 onClick={() => this.props.onClick()}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }
//
// Reason to change from React.Component to function component
//
// In React, function components are a simpler way to write components that only contain a render method and don’t have their own state. Instead of defining a class which extends React.Component, we can write a function that takes props as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

function Square(props) {

    // a function component - it only renders, no internal state

    // Board is its 'parent'

    // In React terms, the Square components are now controlled components. The Board has full control over them.

    // Square is called form Board with two props:
    // 1- a value:    
    // 2- a callback function that takes one argument (integer) that is the index of the square targetted
    //
    // They can be 'reached' from within the 'Board' using the keywords:
    // 1- (this.)props.value
    // 2- (this.)props.onClick

    // QUESTION - pourquoi on a plus le (i) ?

    return (
        // Fro note: plus de arrow function...
        //  In a class, we used an arrow function to access the correct this value,
        // but in a function component we don’t need to worry about this
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    // Game is its 'parent'
    // In React terms, the Board component is now a controlled component. The game has full control over it.

    // Board is called form Game with two props:
    // 1- an array of squares:    
    // 2- a callback function that takes one argument (integer) that is the index of the square targetted.
    // Note: this callback reinforces the encapsulation of parent props - only this callback knows the
    // internal data structure of the parent state.
    //
    // They can be 'reached' from within the 'Board' using the keywords:
    // 1- this.props.squares
    // 2- this.props.onClick(i)

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}   // arrow function syntax is used now
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);   // mandatory
        // 'state' is private to the React component
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }


    handleClick(i) {
        // In React, however, it is a convention to use on[Event] names for props which represent
        // events and handle[Event] for the methods which handle the events.

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();        // immutable trick part 1

        // S'il y a un gagnantt alors arreter de traiter les clicks sur les squares-buttons
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';    // le write/change to memory (on the new copied object)
        this.setState({
            history: history.concat([{
                squares: squares,                       // immutable trick part 2
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // Elegance de ne pas avoir de boucle for ici

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        // Maintenir correctement le message de status du jeu.

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        // FRo: j'ai le feeling qu'on passe un callback qui prendra un argument 'i'
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    // helper function
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
