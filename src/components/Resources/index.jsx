import React from 'react';

const Resources = () => {
  const referenceLinks = [
    {
      title: 'Regional Cover Crop Councils',
      links: [
        'https://www.midwestcovercrops.org/',
        'https://southerncovercrops.org/',
        'https://northeastcovercrops.com/',
        'https://westerncovercrops.org/',
      ],
    },
    {
      title: 'Soil Health and Climate Smart Agriculture',
      links: [
        'https://cra.missouri.edu/',
        'https://www.sare.org/resources/cover-crops/',
        'https://soilhealthinstitute.org/',
        'https://practicalfarmers.org/',
        'https://farmland.org/',
      ],
    },
    {
      title: 'Farmer Profiles and/or Case Studies',
      links: [
        'https://farmland.org/soil-health-case-studies/',
        'https://soilhealthinstitute.org/our-work/initiatives/economics-of-soil-health-systems-on-30-u-s-farms/',
      ],
    },
    {
      title: 'Economic of Cover Crops',
      links: [
        'https://soilhealthinstitute.org/app/uploads/2022/01/100-Farm-Fact-Sheet_9-23-2021.pdf',
      ],
    },
    {
      title: 'Carbon Markets',
      links: [
        'https://ilsustainableag.org/programs/ecomarkets/',
        'https://decode6.org/',
        'https://farmland.org/project/the-carpe-tool/',
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
                    <a href={linkItem} target="_blank" rel="noreferrer">{linkItem}</a>
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
