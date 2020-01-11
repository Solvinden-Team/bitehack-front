import React from 'react';
import './App.css';
import Room from './Room.js'
import {GridList, GridListTile, Paper} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';


const RoomTile = styled(Paper)({
    elevation: 24,
});

const peopleInsideStr = "People inside: ";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        };
    }

    componentDidMount() {
        // return;
        fetch("http://localhost:8080/room/")
            .then(res => res.json())
            .then(data => {
                let roomsFromJson = [];
                for (let i = 0; i < data.length; i++) {
                    roomsFromJson.push(Room({id: i, name: data[i].room, count: data[i].peopleCount, warningLevel: 0}));
                }
                this.setState({ rooms: roomsFromJson })})
            .catch(_ => this.setState({ rooms: [
                    Room({id: 0, name: "kuchniaOffline1", count: 7, warningLevel: 0}),
                    Room({id: 1, name: "kuchniaOffline2", count: 3, warningLevel: 0})
                ] }));
    }

    render() {
        return (
            <div className="App">
                <GridList cellHeight={'auto'} className="Room-grid" cols={4}>
                    <GridListTile className="Subheader" cols={4} style={{height: 'auto'}}>
                        <h1>Chwytliwa Nazwa</h1>
                    </GridListTile>
                    {this.state.rooms.map(tile => (
                        <RoomTile key={tile.id} className="RoomTile">
                            <h2 align={'center'}>{tile.name}</h2>
                            <h3>{peopleInsideStr}{tile.peopleCount}</h3>
                            {/*<h4>{tile.warningLevel}</h4>*/}
                            <text>{tile.description}</text>
                        </RoomTile>
                    ))}
                </GridList>
            </div>
        );
    }
}

export default App;
