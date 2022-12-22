import React from 'react';
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initalValue) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initalValue
    );

    React.useEffect(() => {
        localStorage.setItem('search', value)
    }, [value])

    return [value, setValue];
}

const dataReducer = (state, action) => {
    switch(action.type) {
        case 'SET_STORIES':
            return action.payload;
        case 'REMOVE_STORY': {
            console.log(state);
            return state.filter(
                data => action.payload.objectID !== data.objectID
            )};
        default:
            console.log(Error());
    }
}


const App = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const [data, dispatchData] = React.useReducer(
        dataReducer,
        []
      );

    React.useEffect(() => {
        setIsLoading(true);

        fetch(`${API_ENDPOINT}react`)
        .then(res => res.json())
        .then(response => {
            console.log(response);
            dispatchData({
                type:'SET_STORIES',
                payload: response.hits,
            });

            setIsLoading(false);
        })
        .catch((e) => setIsError(true));
    }, [])

    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search',
        ''
    );

    const removeItem = (item) => {
        dispatchData({
            type:"REMOVE_STORY",
            payload: item
        });
    }

    const searchedData = data.filter((d) => {
        return d.title.toLowerCase().includes(searchTerm.toLowerCase());
    })

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        localStorage.setItem('search', e.target.value);
    }

    return (
        <>
            <h1>List View</h1>
            <Search id="search" type="text" label="search" value={searchTerm} onSearch={handleSearch} isFocused>
                <strong> Search: </strong>
            </Search>

            <hr/>
            {isError && <p>Something went wrong</p>}

            {isLoading ? (
                <p>Loading</p>
            ) : (
                <List list={searchedData} onRemoveItem={removeItem}/>
            )}
        </>
    )
}

const Search = ({id, value, onSearch, isFocused, children}) => {

    return (
        <>
            <label htmlFor='search'>{children}</label>
            <input id={id} type="text" label='search' value={value} onChange={onSearch} />
        </>
    )
}

const List = (props) => {
    return props.list.map((item) => {
            return (
                <Item key={item.id} item={item} onRemoveItem={props.onRemoveItem}/>
            )
        })
}

const Item = ({ item, onRemoveItem }) => {
    const handleRemove = () => {
        onRemoveItem(item);
    }
    return (
        <div key={item.id}>
            <h2>{item.id}</h2>
            <h2>{item.title}</h2>
            <p>{item.name}</p>
            <button onClick={handleRemove}>Remove Item</button>
        </div>
    )
}

export default App;