import React from 'react';
import { useFormControl } from './lib/use-form-control';
import logo from './logo.svg';
import './App.css';

const FormControlExample = () => {
    const validator = (value: any) => value && value.length > 5 ? 'Too long' : undefined;

    const {
        value,
        setValue,
        error
    } = useFormControl({
        defaultValue: '',
        validator,
    });

    return <div>
        <input type="text"
               value={value}
               onChange={e => setValue(e.target.value)}
        />
        <span>{error}</span>
    </div>
};

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>

            <FormControlExample/>
        </div>
    );
}

export default App;
