import { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../state/actions';
import 'react-image-crop/dist/ReactCrop.css';
import Loader from "react-loader-spinner";
import { Typography } from '@mui/material';

const Loading = () => (
    <div style={{ 
      width: "100vw",
      height: "100vh",
      display: "flex",
      position:"absolute",
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center"
    }}><Loader type="ThreeDots" color="#00BFFF" height={80} width={80} /></div>
);

class Logout extends Component {

  static defaultProps = {
    error: null,
    logout: () => null,
  };

  state = {
    error: null,
    showProfile: false,
  };

  componentDidMount() {
      setTimeout(() => this.props.logout(), 1000);
  }
  
  render() {
    return (
      <div className="text-center mt-5">
        <Typography component={"h5"}>Logging out</Typography>
        <Loading />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.access.error,
});

const mapDispatchToProps = dispatch => ({
  logout: (obj) => dispatch(logout(obj)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Logout),
);