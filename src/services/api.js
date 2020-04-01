import axios from 'axios'
import { Alert } from 'react-native'

const api = axios.create({
    baseURL: 'http://192.168.0.105:3002'
})

if(!api){
    Alert.alert('Error!')
}

export default api