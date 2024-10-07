const Settings = async () => {
  const allBrands = await getBrands();
  const allAttributes = await getAttributes();
  const allCategories = await getCategories();

  return (
    <SettingsTabs
      allBrands={allBrands}
      allAttributes={allAttributes}
      allCategories={allCategories}
    />
  );
};
export default Settings;
