import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
        this.onScrollLoading();
    }

    componentWillUnmount() {
        this.onScrollLoading();
    }

    onScrollLoading = () => {
        window.addEventListener('scroll', () => {
            if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
                this.onRequest(this.state.offset);
                window.removeEventListener('scroll', this.onRequest);
            }
        }) 
    }

    onRequest(offset) {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    setRef = ref => {
        this.itemRefs.push(ref);
    }

    focusOnChar = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imageStyle = {'objectFit': 'cover'};
            
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
                imageStyle = {'objectFit' : 'unset'};
            };

            return (
                <li 
                className="char__item" 
                key={item.id} 
                tabIndex={0}
                ref={this.setRef}
                onClick={() => {
                    this.props.onCharSelected(item.id)
                    this.focusOnChar(i)
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        e.preventDefault();
                        this.props.onCharSelected(item.id);
                        this.focusOnChar(i);
                    }
                 }}
                >
                        <img src={item.thumbnail} alt={item.name} style={imageStyle} />
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}
                    className="button button__main button__long" >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propsType = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;