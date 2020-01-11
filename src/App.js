import React from 'react';
import './App.css';
import Room from './Room.js'
import {GridList, GridListTile} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

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
                    roomsFromJson.push(Room({id: i, name: data[i].room, count: data[i].peopleCount, description: data[i].roomDescription, warningLevel: 0}));
                }
                this.setState({ rooms: roomsFromJson })})
            .catch(_ => this.setState({ rooms: [
                    Room({id: 0, name: "Kuchnia off-line 1", count: 7, description: "Ala ma kota", warningLevel: 0}),
                    Room({id: 1, name: "Kuchnia off-line 2", count: 3, description: "Ola ma psa", warningLevel: 0})
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
                        <Card className="RoomTile" variant="outlined">
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {tile.name}
                                </Typography>
                                <Typography className="RoomDescription" color="textSecondary">
                                    {tile.description}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {peopleInsideStr}{tile.peopleCount}
                                </Typography>
                            {/*<h4>{tile.warningLevel}</h4>*/}
                            </CardContent>
                        </Card>
                    ))}
                </GridList>
            </div>
        );
    }
}

export default App;
