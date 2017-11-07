import React, { Component } from 'react'
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
} from 'native-base';
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

class Statistics extends Component {

    componentWillMount() {
        this.props.actions.getDataForStatisticsList()
    }
    render() {
        const listData = this.props.statisticsListItems
            return (
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
              keyExtractor={item => item.id}
            />
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
  seqCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffcc00',
    justifyContent: 'center',
    alignItems: 'center'
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
