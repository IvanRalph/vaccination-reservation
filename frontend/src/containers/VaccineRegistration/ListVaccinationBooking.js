import {
    Table,
    Box,
    Button,
    CssBaseline,
    Typography,
    TableContainer,
    TableCell,
    TableBody,
    TableRow,
    TableHead,
    Container,
} from "@mui/material";
import {Link} from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {Component} from "react";
import api from '../../api';

export class VaccineRegistrationListing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bookings: [],
            isLoading: false
        }

        this.handleDeleteButton = this.handleDeleteButton.bind(this);
    }

    async handleDeleteButton(id) {
        await api.deleteBooking(id);

        window.alert('Booking deleted successfully')

        this.setState({
            bookings: []
        });

        await this.getBookings()
    }

    async getBookings() {
        await api.getAllBookings().then(bookings => {
            this.setState({
                bookings: bookings.data.data
            })
        })
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})

        await this.getBookings()

        this.setState({isLoading: false})
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <Container>
                    <Box sx={{mt: 8}}>
                        <Typography component="h1" variant="h5">
                            Active Booking
                        </Typography>
                        <TableContainer component={Box}>
                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">Center Name</TableCell>
                                        <TableCell align="left">Start Time</TableCell>
                                        <TableCell align="left">&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.bookings.map((row) => (
                                        <TableRow
                                            key={row._id}
                                            sx={{"&:last-child td, &:last-child th": {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.full_name}
                                            </TableCell>
                                            <TableCell align="left">{row.health_center[0].name}</TableCell>
                                            <TableCell align="left">
                                                {row.slot}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Button component={Link} to={'/bookings/' + row._id}>
                                                    <ModeEditIcon/>
                                                </Button>
                                                <Button onClick={() => this.handleDeleteButton(row._id)}>
                                                    <DeleteIcon/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Container>
            </React.Fragment>
        );
    }
}
