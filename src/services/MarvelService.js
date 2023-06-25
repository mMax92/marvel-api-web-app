

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=092a5db3a9f7dc9aa2548b09c8215dfa';

    getResourse = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResourse(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;