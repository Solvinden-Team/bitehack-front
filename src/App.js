import React from 'react';
import './App.css';
import Room from './Room.js'
import {GridList, Paper} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";


const RoomTile = styled(Paper)({
    elevation: 24,
});

const peopleInsideStr = "People inside: ";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            allRooms: [],
            open: false,
            isChecked: false,
            lastSortingKey: "name",
            filters: {}
        };
        this.handleDrawerOpen = () => this.toggleDrawer(true);
        this.handleDrawerClose = () => this.toggleDrawer(false);
        this.toggleDrawer = (open) => {
            this.setState({open: open});
        };
    }


    filterAndSort(sortingKey) {
        let rooms = this.state.allRooms.slice();
        this.setState({
            lastSortingKey: sortingKey,
            rooms: rooms.sort((a, b) => {
                if (!this.state.isChecked)
                    return ((+b[sortingKey] == b[sortingKey]) && (+a[sortingKey] != a[sortingKey])) || (a[sortingKey] - b[sortingKey]);
                else
                    return ((+a[sortingKey] == a[sortingKey]) && (+b[sortingKey] != b[sortingKey])) || (b[sortingKey] - a[sortingKey]);
            })
        })
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
                this.setState({rooms: roomsFromJson});
                this.setState({allRooms: this.state.rooms.slice()})
            })
            .catch(_ => {
                this.setState({
                    rooms: [
                        Room({id: 0, name: "kuchniaOffline1", count: 7, warningLevel: 0}),
                        Room({id: 1, name: "kuchniaOffline2", count: 3, warningLevel: 0})
                    ]
                });
                this.setState({allRooms: this.state.rooms.slice()})
            });
    }

    render() {
        return (
            <div className="App">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.handleDrawerOpen}
                        edge="start"
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h5" color={'white'} noWrap>
                        Chwytliwa Nazwa
                    </Typography>
                </Toolbar>
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={this.state.open}
                >
                    <div>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem>
                            <ListItemText primary="Sorting"/>
                        </ListItem>
                        <ListItem button key="sortByName"
                                  onClick={() => this.filterAndSort('name')}>
                            <ListItemText primary="Name"/>
                        </ListItem>
                        <ListItem button key="sortByCount"
                                  onClick={() => this.filterAndSort('peopleCount')}>
                            <ListItemText primary="Count"/>
                        </ListItem>
                        <ListItem button key="sortByDescription"
                                  onClick={() => this.filterAndSort('description')}>
                            <ListItemText primary="Description"/>
                        </ListItem>
                        <FormControlLabel
                            control={
                                <Checkbox ref="ascending"
                                          onChange={() => {
                                              this.setState({isChecked: this.state.isChecked});
                                              this.filterAndSort(this.state.lastSortingKey);
                                          }}/>
                            }
                            label="Is Ascending?"
                        />
                    </List>
                    <Divider/>
                    <List>
                        <ListItem>
                            <ListItemText primary="Filter"/>
                        </ListItem>
                    </List>
                </Drawer>
                <GridList cellHeight={'auto'} className="Room-grid" cols={4}>
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
