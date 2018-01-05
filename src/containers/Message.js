'use strict'
import React, {PureComponent} from 'react'
import
{
  StyleSheet,
  View,
  Text,
  Platform
}
from 'react-native'
import { Container, Content, Tab, Tabs,Body, Header, Title, Left, Right} from 'native-base';

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor : '#f7f7f7'
  },
})

class Message extends PureComponent {

  render () {
    return (
      <Container>
        <Header>
            <Left/>
            <Body>
                <Title>Message</Title>
            </Body>
            <Right/>
        </Header>
        <View style={styles.container}>
          <Text>
            Messages
          </Text>
        </View>
      </Container>
    )
  }
};

export default Message
