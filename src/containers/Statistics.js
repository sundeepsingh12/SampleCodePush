import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    TouchableHighlight,
}
    from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as statisticsActions from '../modules/statistics/statisticsActions'
import styles from '../themes/FeStyle'
import {
  Container,
  Text,
  List,
  ListItem,
  Icon,
  StyleProvider,
  Header,
  Body,
} from 'native-base';
import getTheme from '../../native-base-theme/components'
import platform from '../../native-base-theme/variables/platform'
import moment from 'moment'
function mapStateToProps(state) {
    return {
        statisticsListItems: state.statistics.statisticsListItems,
    }
}
function mapDispatchToProps(dispatch) {
    return {
         actions: bindActionCreators({ ...statisticsActions }, dispatch)
    }
}

class Statistics extends PureComponent {

    componentDidMount() {
        this.props.actions.getDataForStatisticsList()
    }
    render() {
        const listData = this.props.statisticsListItems
            return (
                <StyleProvider style={getTheme(platform)}>
                <Container>
                  <Header searchBar style={StyleSheet.flatten([styles.bgPrimary, style.header])}>
                    <Body>
                      <View
                        style={[styles.row, styles.width100, styles.justifySpaceBetween, styles.marginBottom10, styles.marginTop15]}>
                        <Icon name="md-arrow-back" style={[styles.fontWhite, styles.fontXl]} onPress={() => { this.props.navigation.goBack(null) }}/>
                        <Text
                          style={[styles.fontCenter, styles.fontWhite, styles.fontLg, styles.alignCenter]}>STATISTICS  {moment(new Date()).format('DD-MM-YYYY')}</Text>
                        <View/>
                      </View>
                    </Body>
                  </Header>
               <FlatList
              data={(Object.values(listData))}
              renderItem={({ item }) => {
                return (
                  <TouchableHighlight underlayColor={'#eee'}>
                    <View style={style.seqCard}>
                      <View style={style.seqCardDetail}>
                        <View>
                        <Text style={[styles.fontDefault, styles.fontWeight500, styles.lineHeight25]}>
                            {item.label}
                        </Text>
                        <Text style={[styles.fontSm, styles.fontWeight300, styles.lineHeight20]}>
                            {item.value}
                        </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              }}
              keyExtractor={item => String(item.id)}
            />
            </Container>
        </StyleProvider>
            )
        }
    }
const style = StyleSheet.create({
  seqCard: {
    minHeight: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  },
  seqCardDetail: {
    flex: 1,
    minHeight: 70,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

});
export default connect(mapStateToProps, mapDispatchToProps)(Statistics)
