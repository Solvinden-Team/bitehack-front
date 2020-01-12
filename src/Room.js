import './Room.css';

function Room(props) {
    return (
        {
            id: props.id,
            name: props.name,
            peopleCount: props.count,
            warningLevel: props.warningLevel,
            description: props.description,
            tags: props.tags,
        }
    )
}


export default Room;