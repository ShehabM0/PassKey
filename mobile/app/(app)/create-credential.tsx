import CreatePageHeader from '@/components/CreatePageHeader';
import PlatfromPicker from '@/components/PlatformPicker';
import { View } from 'react-native';
import { useState } from 'react';

export default function CreateCredential() {
  const [platfromPicker, setPlatformPicker] = useState(true);

  const closePlatformPicker = () => {
    setPlatformPicker(false);
  }

  const platformSelect = (platform: any) => {
    console.log(platform)
  };

  return (
      <View style={{flex: 1}}>
        <CreatePageHeader/>
        { platfromPicker &&
          <PlatfromPicker onClose={closePlatformPicker} onSelect={platformSelect}/> }
      </View>
  );
}

