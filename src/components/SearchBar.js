import React, { Component } from 'react'
import renderIf from '../lib/renderIf'
import { Container, Button, Header, Item, Text, Icon, Input } from 'native-base';
export default class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSearchVisible: false,
            searchText: ''
        }
    }

    _setSearchVisibility(isVisible, text) {
        this.setState(previousState => {
            return {
                isSearchVisible: isVisible,
                searchText: text
            }
        })
    }
    render() {
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Input placeholder="Search"
                            onChangeText={(searchText) => { (searchText.length > 2) ? this._setSearchVisibility(true, searchText) : this._setSearchVisibility(false, searchText) }
                            }
                        />
                        {renderIf(this.props.isScannerEnabled, <Icon name="ios-camera" />)}
                    </Item>
                    {renderIf(this.state.isSearchVisible, <Button transparent
                        onPress={() => this.props.getDataStoreAttrValueMap(this.state.searchText)}>
                        <Text>Search</Text>
                    </Button>)}
                </Header>
            </Container >
        )
    }
}
