import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import logoImg from '../../assets/logo.png'

import Styles from './styles'

import { Feather } from '@expo/vector-icons'

import api from '../../services/api'

export default function Incidents () {

    const [incidents, setIncidents] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    function navigateToDetail (incident) {
        navigation.navigate('Detail', { incident })
    }

    async function loadIncidents() {

        if(loading){// Pra evitar que se uma requisição já estiver sendo feita, ele não a faça de novo
            return
        }

        if(total > 0 && incidents.length == total) {
            return
        }

        setLoading(true)

        const response = await api.get('ongs/all-incidents', {
            params: { page }
        })
            .catch(error => {
                Alert.alert(`Errou: ${error}`)
            })

        setLoading(false)    

        setIncidents([...incidents, ...response.data])    
        setTotal(response.headers['x-total-count'])

        setPage(page + 1)
    }

    useEffect(() => {
        loadIncidents()
    }, [])

    return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                <Image source={logoImg} />
                <Text style={Styles.headerText}>
                    Total de <Text style={Styles.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>
            <Text style={Styles.title}>Bem vindo!</Text>
            <Text style={Styles.description}>Escolha um dos casos abaixo e salve o dia!</Text>
            
            <FlatList 
                style={Styles.incidentList}
                data={incidents}
                showsVerticalScrollIndicator={false}
                keyExtractor={incident => String(incident.id)}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({ item: incident }) => (
                        <View style={Styles.incident}>
                        <Text style={Styles.incidentProperty}>Ong:</Text>
                        <Text style={Styles.incidentValue}>{incident.name}</Text>

                        <Text style={Styles.incidentProperty}>Caso:</Text>
                        <Text style={Styles.incidentValue}>{incident.title}</Text>

                        <Text style={Styles.incidentProperty}>Valor:</Text>
                        <Text style={Styles.incidentValue}>
                            {
                                Intl.NumberFormat('pt-BR', {
                                    style: 'currency', 
                                    currency: 'BRL' 
                                }).format(incident.value) 
                            }
                        </Text>

                        <TouchableOpacity 
                            style={Styles.detailsButton}
                            onPress={() => navigateToDetail(incident)}>
                            <Text style={Styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#e02041"/>
                        </TouchableOpacity>
                    </View>
                )}/>
        </View>
    )
}