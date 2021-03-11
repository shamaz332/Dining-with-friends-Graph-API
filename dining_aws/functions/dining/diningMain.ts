export const convertObjectArrIntoParis = (obj: any) => {

    let keyPair = {};
    
     Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        (keyPair as any)[key] = value[0];
      } else {
        (keyPair as any)[key] = value;
      }
    });
    return keyPair;
  };
      