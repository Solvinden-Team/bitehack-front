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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";


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
            taglist: [],
            tags: {}
        };
        this.handleDrawerOpen = () => this.toggleDrawer(true);
        this.handleDrawerClose = () => this.toggleDrawer(false);
        this.toggleDrawer = (open) => {
            this.setState({open: open});
        };
    }


    filterAndSort(sortingKey) {
        let rooms = this.state.allRooms.slice();
        {/*TODO: fix filtering*/
        }
        // rooms = rooms.filter((room) => room.tags.some((tag => this.state.tags[tag])));
        rooms = rooms.sort((a, b) => {
            if (!this.state.isChecked)
                return ((+b[sortingKey] == b[sortingKey]) && (+a[sortingKey] != a[sortingKey])) || (a[sortingKey] - b[sortingKey]);
            else
                return ((+a[sortingKey] == a[sortingKey]) && (+b[sortingKey] != b[sortingKey])) || (b[sortingKey] - a[sortingKey]);
        });
        this.setState({
            lastSortingKey: sortingKey,
            rooms: rooms
        })
    }

    componentDidMount() {
        // return;
        fetch("http://localhost:8080/room/")
            .then(res => res.json())
            .then(data => {
                let roomsFromJson = [];
                for (let i = 0; i < data.length; i++) {
                    roomsFromJson.push(Room({
                        id: i,
                        name: data[i].room,
                        count: data[i].peopleCount,
                        description: data[i].roomDescription,
                        warningLevel: 0
                    }));
                }
                this.setState({rooms: roomsFromJson});
                this.setState({allRooms: this.state.rooms.slice()})
            })
            .catch(_ => {
                this.setState({
                    rooms: [
                        Room({id: 0, name: "kuchniaOffline1", count: 7, warningLevel: 0, tags: ['tset']}),
                        Room({id: 1, name: "kuchniaOffline2", count: 3, warningLevel: 0, tags: ['test']})
                    ]
                });
                this.setState({
                    allRooms: this.state.rooms.slice(),
                    taglist: ['test', 'tset'],
                    tags: {'test': false, 'tset': false}
                })
            });

        fetch("http://localhost:8080/tags/")
            .then(res => res.json())
            .then(data => {
                this.setState({taglist: data});
                let tags = {};
                for (let i = 0; i < data.length; i++) {
                    tags[data[i]] = false;
                }
                this.setState({tags: tags});
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
                        Coffree
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
                                              this.setState({isChecked: !this.state.isChecked});
                                              this.filterAndSort(this.state.lastSortingKey);
                                          }}/>
                            }
                            label="Is Ascending?"
                        />
                    </List>
                    <Divider/>
                    {/*TODO: fix filtering*/}
                    {/*<List>*/}
                    {/*    <ListItem>*/}
                    {/*        <ListItemText primary="Filter"/>*/}
                    {/*    </ListItem>*/}
                    {/*    {this.state.taglist.map(tag => (*/}
                    {/*        <FormControlLabel*/}
                    {/*            control={*/}
                    {/*                <Checkbox*/}
                    {/*                    onChange={() => {*/}
                    {/*                        let tags = {...this.state.tags};*/}
                    {/*                        tags[tag] = !tags[tag];*/}
                    {/*                        this.setState({tags: tags});*/}
                    {/*                        this.filterAndSort(this.state.lastSortingKey);*/}
                    {/*                    }}/>*/}
                    {/*            }*/}
                    {/*            label={tag}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</List>*/}
                </Drawer>
                <GridList cellHeight={'auto'} className="Room-grid" cols={4}>
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
