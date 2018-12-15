import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const Header = () => {
    return (
        <section className="hero is-dark">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title is-uppercase has-text-warning has-text-centered">
                        Star Wars
                    </h1>
                    <h2 className="subtitle has-text-centered">
                        Kami lah penduduk angkasa
                    </h2>
                </div>
            </div>
        </section>
    );
}

const Profil = ({profil}) => {
    return (
        <div className="card">
            <div className="card-image">
                <figure className="image is-4by3">
                    {profil.gender === 'male' ? 
                        <img src="/images/male.svg" alt="Male" />    
                    : profil.gender === 'female' ?
                        <img src="/images/female.svg" alt="Female" />
                    :
                        <img src="/images/na.svg" alt="Not Human" />
                    }
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className="title is-4">{profil.name}</p>
                    </div>
                </div>
                <div className="content">
                    Birth year: {profil.birth_year} <br/>
                    Gender: {profil.gender} <br/>
                    Height: {profil.height} cm<br/>
                    Mass: {profil.mass} kg<br/>
                </div>
            </div>
        </div>
    );
}

const Footer = () => {
    return (
        <footer className="hero is-dark">
            <div className="hero-body">
                <div className="container">
                    <div className="content has-text-centered">
                        <p>
                            <strong>Star Wars App</strong> by <a className="has-text-info" href="http://risnanto.herobo.com">Heri Risnanto</a>.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const SWAPI = 'https://swapi.co/api/people/?format=json&page=';

class StarWarsApp extends Component{
    constructor(props){
        super(props);
        this.state = {
            results: [],
            count: null,
            isLoading: false,
            error: null,
            currentPage: 1,
            profilPerPage: 10,
        }
        this.pageSWAPI = this.pageSWAPI.bind(this);
    }

    pageSWAPI(event){
        this.setState({ currentPage: Number(event.target.id) },
            this.componentDidMount
        );
    }

    componentDidMount() {
        this.setState({ isLoading:true });
        fetch(SWAPI + this.state.currentPage)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Ada yang salah...');
                }
            })
            .then(res => this.setState({ 
                results: res.results,
                count: res.count,
                isLoading: false }))
            .catch(error => this.setState({
                error, 
                isLoading:false }));
    }

    render(){
        const { results, isLoading, error, currentPage, profilPerPage } = this.state;

        if (error) {
            return <p>Error: {error.message}</p>;
        }

        if (isLoading) {
            return <p>Loading ...</p>;
        }

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.count / profilPerPage); i++ ) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li>
                    <button  
                        className="pagination-link"
                        style={{cursor: 'pointer'}}
                        key={number}
                        id={number}
                        onClick={this.pageSWAPI}    
                    >
                        {number}
                    </button>
                </li>
            );
        });

        return (
            <div>
                <Header />
                <section className="section">
                    <div className="columns is-multiline">
                        {results.map(profil =>
                            <div className="column is-one-fifth" key={profil.results}>
                                <Profil profil={profil} />
                            </div>
                        )}
                    </div>
                    <div className="columns has-text-centered">
                        <div className="column">
                            Page <span className="has-text-weight-bold is-size-5">{currentPage}</span> / {pageNumbers.length}
                        </div>
                    </div>
                    <nav className="pagination is-rounded is-centered" role="navigation" aria-label="pagination">
                        <ul className="pagination-list">
                            {renderPageNumbers}
                        </ul>
                    </nav>
                    <br/>
                </section>
                <Footer />
            </div>
        );
    }
}

ReactDOM.render(<StarWarsApp />, document.getElementById('root'));