import React from 'react';

const Resources = () => {
  const referenceLinks = [
    {
      title: 'Regional Cover Crop Councils',
      links: [
        {
          name: 'Midwest Cover Crop Council homepage',
          link: 'https://www.midwestcovercrops.org/',
        },
        {
          name: 'Southern Cover Crop Council homepage',
          link: 'https://southerncovercrops.org/',
        },
        {
          name: 'Northeast Cover Crop Council homepage',
          link: 'https://northeastcovercrops.com/',
        },
        {
          name: 'Western Cover Crop Council homepage',
          link: 'https://westerncovercrops.org/',
        },
      ],
    },
    {
      title: 'Soil Health and Climate Smart Agriculture',
      links: [
        {
          name: 'Missouri CRCL Project',
          link: 'https://cra.missouri.edu/',
        },
        {
          name: 'Cover Crops for Sustainable Crop Rotations',
          link: 'https://www.sare.org/resources/cover-crops/',
        },
        {
          name: 'Soil Health Insititute homepage',
          link: 'https://soilhealthinstitute.org/',
        },
        {
          name: 'Practical Farmers homepage',
          link: 'https://practicalfarmers.org/',
        },
        {
          name: 'American Farmland Trust homepage',
          link: 'https://farmland.org/',
        },
        {
          name: 'Apple Podcast',
          link: 'https://podcasts.apple.com/us/podcast/soil-sense/id1474699736',
        },
        {
          name: 'FSH website - Soil Sense episodes (linked to Spotify)',
          link: 'https://farmersforsoilhealth.com/success-stories/',
        },
      ],
    },
    {
      title: 'Farmer Profiles and/or Case Studies',
      links: [
        {
          name: 'Soil Health Case Studies',
          link: 'https://farmland.org/soil-health-case-studies/',
        },
        {
          name: 'Economics of Soil Health Systems on 30 U.S. Farms',
          link: 'https://soilhealthinstitute.org/our-work/initiatives/economics-of-soil-health-systems-on-30-u-s-farms/',
        },
      ],
    },
    {
      title: 'Economic of Cover Crops',
      links: [
        {
          name: 'Economics of Soil Health Systems on 100 Farms',
          link: 'https://soilhealthinstitute.org/app/uploads/2022/01/100-Farm-Fact-Sheet_9-23-2021.pdf',
        },
      ],
    },
    {
      title: 'Carbon Markets',
      links: [
        {
          name: 'Ecosystem Marketss - Illinois Sustainable AG Partnership',
          link: 'https://ilsustainableag.org/programs/ecomarkets/',
        },
        {
          name: 'Decode 6 Homepage',
          link: 'https://decode6.org/',
        },
        {
          name: 'CaRPE Tool',
          link: 'https://farmland.org/project/the-carpe-tool/',
        },
      ],
    },
    {
      title: 'Machinery',
      links: [
        {
          name: 'Machinery Extension Guide',
          link: 'https://extension.missouri.edu/publications/g1209',
        },
      ],
    },
  ];

  return (
    <div className="Resources">
      <h1>Resources</h1>
      <p>
        Numerous resources exist to assist with decisions on the use of cover crops.
        Listed below are links to groups with extensive educational resources on conservation practices, soil health, and use of cover crops.
      </p>

      <ul>
        {
          referenceLinks.map((item) => (
            <li key={item.title} style={{ marginTop: '10px' }}>
              {item.title}
              <ul>
                {item.links.map((linkItem) => (
                  <li key={linkItem} style={{ marginTop: '6px' }}>
                    <a href={linkItem.link} target="_blank" rel="noreferrer">{linkItem.name}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))
        }
      </ul>
    </div>
  );
}; // Resources

Resources.menu = (
  <span>
    Res
    <u>o</u>
    urces
  </span>
);

export default Resources;
