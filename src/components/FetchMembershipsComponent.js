// components/FetchMembershipsComponent.js
const fetchMemberships = async ({
  clubType,
  status,
  category = '',
  setLoading,
  setData,
  setError
}) => {
  setLoading(true);
  setError('');
  setData([]);

  try {
    let allData = [];
    const statuses = Array.isArray(status) ? status : [status];

    for (const singleStatus of statuses) {
      try {
        let data = null;

        if (category) {
          const response = await fetch('https://ldo.mohua.gov.in/edharti/api/membership/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              club_type: clubType,
              status_name: singleStatus,
              category,
            }),
          });

          data = await response.json();

          if (response.ok && Array.isArray(data.memberships) && data.memberships.length > 0) {
            allData = allData.concat(data.memberships);
          } else {
            console.info(`No records for status "${singleStatus}" with category "${category}"`);
          }

        } else {
          const response = await fetch(`https://ldo.mohua.gov.in/edharti/api/membership/${clubType}/${singleStatus}`);
          data = await response.json();

          if (response.ok && Array.isArray(data.memberships) && data.memberships.length > 0) {
            allData = allData.concat(data.memberships);
          } else {
            console.info(`No records for status "${singleStatus}"`);
          }
        }
      } catch (innerError) {
        console.error(`Failed to fetch status "${singleStatus}"`, innerError);
      }
    }

    setData(allData);
    if (allData.length === 0) {
      setError("No records available.");
    }

  } catch (error) {
    console.error("Unexpected error while loading memberships:", error);
    setData([]);
    setError("Unable to load data. Please try again later.");
  } finally {
    setLoading(false);
  }
};

export default fetchMemberships;
