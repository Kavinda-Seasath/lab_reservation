import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';

//import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css
//import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class Search extends React.Component {
  constructor (props) {
    super(props);



    this.state = {
      startDate: moment().startOf('day'),
      labdata: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addReservationDate = this.addReservationDate.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });

  }


  /*addReservationDate() {
    //grab state
    const {
      startDate,
    } = this.state;
    console.log('1st point');
    //post request to backend
    fetch('/api/account/addreservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: startDate,
      })})
      .then(function(response){
        this.setState({data: response.data});
      });
    console.log(this.state.data);
    console.log(this.state.startDate);
  }*/




  addReservationDate() {
    var _this = this;
    axios.post('api/account/addreservation', {

        date: this.state.startDate,

    }).then(function(response) {
      console.log(response);
      _this.setState({ labdata: response.data});
      console.log(_this.state.labdata);
    })
      .catch(function (error) {
        console.log(error);
      });
  }





  render() {
    return (
    <div className="col-lg-12">
      <div className="col-md-4"></div>
      <div className="col-md-8">
        <div className="col-sm-4">
        <DatePicker selected={this.state.startDate} onChange={this.handleChange}/>
        </div>
        <div className="col-sm-4">
        <button className="btn btn-primary" onClick={this.addReservationDate}>Search</button>
        </div>
      </div>

    </div>
    )
  }
}

export default Search;
