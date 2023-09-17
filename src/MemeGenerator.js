import './MemeGenerator.scss'; // Import the SCSS file
import { useEffect, useState } from 'react';

// Missing: More Lines, Style attribute for top, clear button, search and enter function
// Main Function
function MemeGenerator() {
  const [randomTemplate, setRandomTemplate] = useState(null);
  const [topText, setTopText] = useState(' ');
  const [bottomText, setBottomText] = useState(' ');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTwo, setIsTwo] = useState(null);
  const [dataTemplates, setDataTemplates] = useState([]);

  const transformUrl = (text) => {
    // Define the transformation rules
    const rules = {
      _: ' ',
      '-': ' ',
      __: '_',
      '--': '-',
      '~n': '\n',
      '~q': '?',
      '~a': '&',
      '~p': '%',
      '~h': '#',
      '~s': '/',
      '~b': '\\',
      '~l': '<',
      '~g': '>',
      "''": '"',
    };

    // Apply the transformation rules to the input text
    let transformed = text;
    for (const pattern in rules) {
      transformed = transformed.split(pattern).join(rules[pattern]);
    }

    return transformed;
  };

  // Fetching Template Objects
  const fetchTemplates = () => {
    fetch('https://api.memegen.link/templates')
      .then((response) => response.json())
      .then((data) => {
        setDataTemplates(data);
        const randomIndex = Math.floor(Math.random() * data.length);
        setRandomTemplate(data[randomIndex]);
        const isTemplateWithTwoLines = data[randomIndex].lines === 2;

        setIsTwo(isTemplateWithTwoLines);

        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching template:', error);
      });
  };
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle Changing Top Text Input !!ADD FUNCTION OF MORE LINES
  const handleInputChangeTop = (e) => {
    if (e.target.value === '') {
      setTopText(' ');
    } else {
      const newText = e.target.value;
      const transformedUrl = transformUrl(newText);
      setTopText(transformedUrl);
    }
  };

  // Handle Changing Bottom Text Input
  const handleInputChangeBottom = (e) => {
    const newText = e.target.value;
    const transformedUrl = transformUrl(newText);
    setBottomText(transformedUrl);
  };

  // Change the template from dropdown
  const handleTemplateChange = (e) => {
    const selectedTemplateId = e.target.value;
    const selectedTemplate = dataTemplates.find(
      (template) => template.id === selectedTemplateId,
    );
    setRandomTemplate(selectedTemplate);
    setIsTwo(selectedTemplate.lines === 2);
  };

  // Gemerate a Meme URL with the input text
  const generateMemeUrl = () => {
    let memeUrl = `https://api.memegen.link/images/${randomTemplate.id}/`;
    memeUrl += encodeURIComponent(topText);
    memeUrl += `/${encodeURIComponent(bottomText)}`; // adjust for more lines
    memeUrl += `.png`;

    return memeUrl;
  };

  // Download  function for button
  function downloadFileFromUrl(url, filename) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.blob();
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = objectURL;
        a.download = filename;

        a.click();

        URL.revokeObjectURL(objectURL);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  }

  // HTML/CSS/JS Render:
  return (
    <div>
      {isLoaded ? (
        <div className="meme-generator">
          <h1>Meme Generator</h1>
          <label htmlFor="Meme template">Meme template</label>
          <select
            id="Meme template"
            onChange={handleTemplateChange}
            value={randomTemplate ? randomTemplate.id : ''}
          >
            <option value="">Select Template</option>
            {dataTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>

          <img
            src={generateMemeUrl()}
            alt="Generate Meme"
            data-test-id="meme-image"
          />

          <OneOrTwo
            isTwo={isTwo}
            topText={topText}
            bottomText={bottomText}
            handleInputChangeTop={handleInputChangeTop}
            handleInputChangeBottom={handleInputChangeBottom}
          />
          <button
            onClick={() => downloadFileFromUrl(generateMemeUrl(), topText)}
            className="download"
          >
            Download
          </button>
          <br />
          <button
            onClick={() => {
              setBottomText(' ');
              setTopText(' ');
            }}
            className="download"
          >
            Clear
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

// Rendering One or Two InputFields
function OneOrTwo({
  isTwo,
  topText,
  bottomText,
  handleInputChangeTop,
  handleInputChangeBottom,
}) {
  return isTwo ? (
    <>
      <form />
      <label htmlFor="Top text">Top Text</label>
      <input
        id="Top text"
        className="meme-generator input"
        value={topText}
        onChange={handleInputChangeTop}
      />
      <label htmlFor="Bottom text">Bottom Text</label>
      <input
        id="Bottom text"
        className="meme-generator input"
        value={bottomText}
        onChange={handleInputChangeBottom}
      />
    </>
  ) : (
    <input
      placeholder="Top Text"
      value={topText}
      onChange={handleInputChangeTop}
    />
  );
}

export default MemeGenerator;
