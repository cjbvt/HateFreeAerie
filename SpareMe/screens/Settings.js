'use strict';
import React, { Component } from 'react';
import { Dimensions, Alert, StyleSheet, Text, View, Button, TextInput, NetInfo, Image } from 'react-native';
import FilterWebView from '../components/FilterWebView'
import Connectivity from '../components/Connectivity'
import firebase from 'react-native-firebase';
import * as constants from 'constants'

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }
        };
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log(isConnected);
            this.setState({isConnected: isConnected});
        });
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.onConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.onConnectivityChange);
    }

    onConnectivityChange = isConnected => {
        this.setState({isConnected: isConnected});
    }

    onDelete = () => {
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete the account?',
          [
            {text: 'Delete', onPress: () => {
                if (firebase.auth().currentUser == null) {
                  this.props.navigation.navigate('SignIn');
                } else {
                  firebase.auth().currentUser.delete().then(function() {
                  // User deleted
                  }).catch(function(error) {
                  // An error happened.
                  });
                  this.props.navigation.goBack();
                }
            }},
            {text: 'Cancel', onPress: () => console.log('cancelled')}
          ],
          { cancelable: false }
        )
    }

    onLayout = (event) => {
        this.setState({
            layout:{
                height: event.nativeEvent.layout.height,
                width: event.nativeEvent.layout.width,
            }
        });
    }

    render() {
        if (!this.state.isConnected) {
            return(
                <Connectivity />
            );
        }
        return (
            <View style={styles.container} onLayout={this.onLayout}>
                <Image source={require('./photo.jpeg')} resizeMode='cover' style={[styles.backgroundImage, {height: this.state.layout.height, width: this.state.layout.width}]}/>
                <View style={styles.settingsView}>
                    <Text style={styles.settingsText}>
                        Settings
                    </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.leftButton}>
                            <Button
                                title='Delete Account'
                                onPress={this.onDelete}
                                color={constants.COLOR_POSITIVE}
                            />
                        </View>
                        <View style={styles.button}>
                            <Button
                                title='Cancel'
                                color={constants.COLOR_NEGATIVE}
                                onPress={() => this.props.navigation.goBack()}
                            />
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    settingsView: {
        padding: 50,
        flex: 1,
        backgroundColor: constants.COLOR_MAIN_TRANSPARENT,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    leftButton: {
        flex: 1,
        height: 40,
        marginRight: 10
    },
    button: {
        flex: 1,
        height: 40
    },
    connectionContainer: {
        flex: 1,
        backgroundColor: constants.COLOR_MAIN,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    connectionText: {
        color: constants.COLOR_WHITE,
        fontSize: constants.TEXT_LARGE
    },
    settingsText: {
        color: constants.COLOR_WHITE,
        fontSize: constants.TEXT_HEADER,
        marginBottom: 20
    },
    backgroundImage: {
        position: 'absolute',
        zIndex: -1
    }
});
