import { GET_RELATED_CREDENTIALS } from '@/api/graphql/queries';
import { GET_USER_CREDENTIALS } from '@/api/graphql/queries';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMutation, useQuery } from '@apollo/client/react';
import { UPDATE_CREDENTIAL } from '@/api/graphql/mutations';
import { GetRelatedCredentialsData } from '@/types/graphql';
import { router, useLocalSearchParams } from 'expo-router';
import SuccessMessage from '@/components/SuccessMessage';
import CredentialCard from '@/components/CredentialCard';
import CreatePageHeader from '@/components/PageHeader';
import PasswordPIN from '@/components/PopUpPassword';
import PopupMessage from '@/components/PopUpMessage';
import { Colors } from '@/components/common/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Svg, { Path } from 'react-native-svg';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { CredentialDAO } from '@/types';
import {
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Text,
  View,
} from 'react-native';

export default function CredentialPage() {
  const params = useLocalSearchParams<{
    id: string,
    platformIcon: string,
    platformTitle: string,
    platformColor: string,
    email: string,
    created_at: string,
    updated_at: string
  }>();

  const limit = 20;
  const page = 1;
  const { data, loading, fetchMore } = useQuery<GetRelatedCredentialsData> (
      GET_RELATED_CREDENTIALS,
      {
        variables: { id: Number(params.id), page, limit },
      }
    );
  
  const credentials = data?.relatedCredentials?.data || [];
  const pagination = data?.relatedCredentials?.pagination;

  const credentialPageNav = (cred: any) => {
    router.push({
      pathname: '/credential',
      params: cred
    });
  }

  const credential: CredentialDAO = {
    email: params.email ?? '',
    password: '•••••••••••'
  };

  const [email, setEmail] = useState(credential.email)
  const [password, setPassword] = useState(credential.password)
  const [showPassword, setshowPassword] = useState(false);

  const [updateCredential] = useMutation(UPDATE_CREDENTIAL);

  const [PIN, setPIN] = useState(false);
  const [verify, setVerification] = useState(false);

  const [edit, setEdit] = useState(false);
  const [popup, setPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(verify)
      showPIN(false);
  }, [verify]);

  const onSaveEdit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
        await updateCredential({
        variables: {
          credentialId: Number(params.id),
          email,
          password
        },
        refetchQueries: [
          {
            query: GET_USER_CREDENTIALS,
            variables: { page: 1, limit: 20 },
          },
          {
            query: GET_RELATED_CREDENTIALS,
            variables: { id: Number(params.id), page: 1, limit },
          },
        ],
        awaitRefetchQueries: true,
      });

      setIsLoading(false);
      setSuccess(true);
      router.replace({
        pathname: '/homepage',
        params: { navSuccessMessage: "Credential updated" }
      });
    } catch (error: any) {
      Alert.alert('Credential Creation Failed!', error.message);
      setIsLoading(false);
    }
  };

  const onEdit = () => {
    if(verify)
      setEdit(true);
    else
      showPIN(true);
  }

  const onCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setPopup(true);
  }

  const onCopyEmail = () => {
    onCopy(email);
  }

  const onCopyPassword = () => {
    if(verify)
      onCopy(password);
    else
      showPIN(true);
  }

  const showPIN = (flag: boolean) => {
    setPIN(flag);
  }

  const toggleShowPassword = () => {
    if(showPassword)
      setshowPassword(false);
    else
      if(verify)
        setshowPassword(true);
      else
        showPIN(true);
  }

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loading) return;

    fetchMore({
      variables: {
        page: pagination.currentPage + 1,
        limit
      },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          relatedCredentials: {
            ...fetchMoreResult.relatedCredentials,
            data: [
              ...prev.relatedCredentials.data,
              ...fetchMoreResult.relatedCredentials.data,
            ],
          },
        };
      },
    });
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '';

    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <View style={styles.container} >
      <CreatePageHeader color={Colors.white} />

      { success &&
        <SuccessMessage
          message='Credential updated'
          onClose={()=> setSuccess(false)}
        />
      }

      { popup &&
        <PopupMessage 
          message='Copied to clipboard.'
          onClose={()=> setPopup(false)}
        />
      }

      { PIN &&
        <PasswordPIN credentialId={params.id} onClose={showPIN} setVerification={setVerification} setPassword={setPassword}/>
      }
      
      <ScrollView style={styles.content}>

        {/* Platform */}
        <View style={styles.platformContainer}>
          <View style={styles.iconContainer}>
            <Svg width={30} height={30} viewBox="0 0 24 24" >
              <Path d={params.platformIcon} fill={`#${params.platformColor}`} />
            </Svg>
          </View>
          <Text style={styles.title}>{params.platformTitle}</Text>
        </View>

        {/* Credential details & form */}
        <View style={styles.form}>

          {/* email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={edit}
            />
            <MaterialIcons name="content-copy" size={24} color="black" onPress={onCopyEmail} />
          </View>

          {/* password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={edit}
            />
            <Ionicons
                name={showPassword? "eye" : "eye-off"}
                size={24}
                color="black"
                onPress={toggleShowPassword}
                style={{marginRight: 10}}
            />
            <MaterialIcons name="content-copy" size={24} color="black" onPress={onCopyPassword} />
          </View>

          {/* Buttons */}
          {
            !edit ? (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton, isLoading && styles.buttonDisabled]}
                  onPress={onEdit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <Text style={styles.buttonText}>Edit</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton, isLoading && styles.buttonDisabled]}
                  onPress={onEdit}
                  disabled={isLoading}
                >
                  <Feather name="trash" size={18} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={onSaveEdit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            )
          }
        </View>

        {/* Timestamps */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <MaterialIcons name="schedule" size={18} color={Colors.gray500} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>Created</Text>
              <Text style={styles.metaValue}>{formatDate(params.created_at)}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <MaterialIcons name="update" size={18} color={Colors.gray500} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>Last updated</Text>
              <Text style={styles.metaValue}>{formatDate(params.updated_at)}</Text>
            </View>
          </View>
        </View>

        {/* Horzinotal line */}
        <View style={styles.horzLineContainer}>
          <View style={styles.horzLine}/>
        </View>

        {/* Related Credetnial */}
        {
          credentials?.length ? (
            <>
            {credentials.map((item) => (
              <View key={item.id}>
                <CredentialCard {...item} onPress={() => credentialPageNav(item)}  />
              </View>
            ))}

            {pagination?.hasNextPage && (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore} >
                <Text style={styles.loadMoreTxt}>Load more</Text>
              </TouchableOpacity>
            )}
            </>
          ) : ( loading ? (
              <ActivityIndicator size={24} color={Colors.black} />
            ) : (
            <View style={styles.nocredentialsContainer}>
              <Text style={styles.emptyTitle}>No Other Accounts</Text>
              <Text style={styles.emptySubtitle}>
                Other credential accounts will appear here
              </Text>
            </View>
            )
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },

  content: {
    flex: 1,
    paddingHorizontal: 24
  },
  
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.gray900,
  },

  plus: {
    color: 'blue',
  },

  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },

  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  form: {
    width: '100%',
  },

  input: {
    flex: 1,
    flexDirection: 'row',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: Colors.gray900,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonDisabled: {
    backgroundColor: Colors.gray300
  },

  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  editButton: {
    width: '75%',
  },

  deleteButton: {
    width: '20%',
    backgroundColor: Colors.red
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  horzLineContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  horzLine: {
    backgroundColor: Colors.gray500,
    marginVertical: 20,
    height: 1,
    width: '80%',
  },

  metaCard: {
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaTextContainer: {
    marginLeft: 10,
  },

  metaLabel: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '500',
  },

  metaValue: {
    fontSize: 14,
    color: Colors.gray900,
    fontWeight: '600',
  },

  metaDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 10,
  },

  credentialsContainer: {
    marginBottom: 50
  },

  loadMoreBtn: {
    backgroundColor: Colors.gray200,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },

  loadMoreTxt: {
    color: Colors.gray700,
    fontWeight: '600',
  },

  nocredentialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray700,
  },

  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
});

