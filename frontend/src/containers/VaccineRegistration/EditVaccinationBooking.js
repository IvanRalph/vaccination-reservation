import {
    Container,
    Box,
    Button,
    Typography,
    CssBaseline,
    TextField,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDayjs";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker'
import React, {Component} from "react";
import api from "../../api";
import _ from 'lodash';
import Moment from 'moment';

export class EditVaccineRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nric: '',
            name: '',
            selectedCenter: '',
            selectedTimeSlot: '',
            date: new Date(),
            centers: [],
            isLoading: false
        };
        this.handleSelectCenter = this.handleSelectCenter.bind(this);
        this.handleSelectTimeSlot = this.handleSelectTimeSlot.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNricTextChange = this.handleNricTextChange.bind(this);
        this.handleNameTextChange = this.handleNameTextChange.bind(this);
        this.handleRegisterButton = this.handleRegisterButton.bind(this);
    }

    timeSlots() {
        return [
            '8:00 AM','8:15 AM','8:30 AM','8:45 AM','9:00 AM','9:15 AM','9:30 AM','9:45 AM','10:00 AM','10:15 AM','10:30 AM','10:45 AM','11:00 AM','11:15 AM','11:30 AM','11:45 AM','12:00 PM','1:00 PM','1:15 PM','1:30 PM','1:45 PM','2:00 PM','2:15 PM','2:30 PM','2:45 PM','3:00 PM','3:15 PM','3:30 PM','3:45 PM','4:00 PM','4:15 PM','4:30 PM','4:45 PM','5:00 PM','5:15 PM','5:30 PM','5:45 PM','6:00 PM','6:15 PM','6:30 PM','6:45 PM','7:00 PM','7:15 PM','7:30 PM','7:45 PM','8:00 PM',
        ]
    }

    timeSlotCounter(centerId) {
        let center = _.find(this.state.centers, { '_id' : centerId })
        return (center.work_hours * 4);
    }

    handleSelectCenter(event) {
        const state = this.state;
        this.setState({...state, selectedCenter: event.target.value});
    }

    handleSelectTimeSlot(event) {
        const state = this.state;
        this.setState({...state, selectedTimeSlot: event.target.value});
    }

    handleDateChange(value) {
        const state = this.state;
        this.setState({...state, date: value});
    }

    handleNricTextChange(event) {
        const state = this.state;
        this.setState({...state, nric: event.target.value});
    }

    handleNameTextChange(event) {
        const state = this.state;
        this.setState({...state, name: event.target.value});
    }

    async handleRegisterButton(event) {
        event.preventDefault()
        this.setState({isLoading: true})

        let payload = {
            nric_number : this.state.nric,
            full_name : this.state.name,
            health_center_id: this.state.selectedCenter,
            slot: Moment(this.state.date).format('MM-DD-YYYY') + ' ' + this.state.selectedTimeSlot
        }

        await api.updateBooking(this.props.match.params.bookingId, payload).then(res => {
            window.alert(`Appointment updated successfully!`)

            this.props.history.push('/bookings')
        }).catch(err => {
            window.alert(err.response.data.message)
        })
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})

        await api.getAllCenters().then(centers => {
            this.setState({
                centers: centers.data.data
            })
        })

        await api.getBookingById(this.props.match.params.bookingId)
            .then(booking => {
                let data = booking.data.data;

                this.setState({
                    nric: data.nric_number,
                    name: data.full_name,
                    selectedCenter: data.health_center_id,
                    date: _.split(data.slot, ' ')[0],
                    selectedTimeSlot: _.split(data.slot, ' ')[1] + ' ' + _.split(data.slot, ' ')[2]
                })
            })

        this.setState({isLoading: false})
    }

    render() {
        let timeSlotLabel;
        let timeSlotSelect;
        let dateSlot;

        if (this.state.selectedCenter) {
            timeSlotLabel = <InputLabel id="timeSlotLabel">Time Slot</InputLabel>
            timeSlotSelect = <Select
                labelId="timeSlotLabel"
                label="Time Slot"
                required
                fullWidth
                id="timeSlot"
                onChange={this.handleSelectTimeSlot}
                value={this.state.selectedTimeSlot}
                sx={{mb: 2}}
            >
                {
                    this.timeSlots().map((v, i) => {
                        if (i < this.timeSlotCounter(this.state.selectedCenter)) {
                            return <MenuItem key={v} value={v}>{v}</MenuItem>;
                        }
                    })
                }
            </Select>
            dateSlot = <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Appointment Date"
                    value={this.state.date}
                    onChange={(newValue) => {
                        this.handleDateChange(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        }

        return (
            <React.Fragment>
                <CssBaseline/>
                <Container>
                    <Box
                        component="form"
                        sx={{
                            mt: 8,
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Update Slot
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nric"
                            label="NRIC Number"
                            name="NRIC"
                            value={this.state.nric}
                            onChange={this.handleNricTextChange}
                            autoComplete="nric"
                            sx={{mb: 2}}
                            autoFocus
                        />
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleNameTextChange}
                            autoComplete="name"
                            sx={{mb: 2}}
                        />

                        <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
                        <Select
                            labelId="vaccineCenterLabel"
                            label="Vaccine Center"
                            required
                            fullWidth
                            id="vaccineCenter"
                            value={this.state.selectedCenter}
                            onChange={this.handleSelectCenter}
                            sx={{mb: 2}}
                        >
                            {this.state.centers.map((v) => {
                                return <MenuItem key={v._id} value={v._id}>{v.name}</MenuItem>;
                            })}
                        </Select>

                        { dateSlot }

                        { timeSlotLabel }
                        { timeSlotSelect }

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={this.handleRegisterButton}
                            sx={{mt: 3, mb: 2}}
                        >
                            Update
                        </Button>
                    </Box>
                </Container>
            </React.Fragment>
        );
    }
}
