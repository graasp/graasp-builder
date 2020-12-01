const items = [
  {
    id: '5f6c68c8609dcab47158fda2',
    name: 'Mathematics',
    description:
      'Mathematics is the abstract study of topics such as quantity (numbers), structure, space, and change. There is a range of views among mathematicians and philosophers as to the exact scope and definition of mathematics.',
    creator: {
      name: 'Lydia Keith',
      avatar: 'https://api.adorable.io/avatars/220',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1581089778245-3ce67677f718?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    },
    path: '5f6c689c2814719d2abcccfb-5f6c68c8609dcab47158fda2',
  },
  {
    id: '5f6c68cee60b191d841f0fa6',
    name: 'Python',
    description:
      "Python is an interpreted, high-level and general-purpose programming language. Created by Guido van Rossum and first released in 1991, Python's design philosophy emphasizes code readability with its notable use of significant whitespace. Its language constructs and object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects.",
    creator: {
      name: 'Tamzin Berry',
      avatar: 'https://api.adorable.io/avatars/341',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80',
    },
    path: '5f6c689c2814719d2abcccfb-5f6c68cee60b191d841f0fa6',
  },
  {
    id: '5f6c68d3cc839782f16b68b8',
    name: 'Capitalism',
    description:
      'Capitalism is an economic system based on the private ownership of the means of production and their operation for profit. Characteristics central to capitalism include private property, capital accumulation, wage labor, voluntary exchange, a price system and competitive markets.',
    creator: {
      name: 'Ernie Brady',
      avatar: 'https://api.adorable.io/avatars/130.png',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    },
    path: '5f6c689c2814719d2abcccfb-5f6c68d3cc839782f16b68b8',
  },
  {
    id: '5f6c68dacb58aae02ee8d56e',
    name: 'Cities',
    description:
      "The Anthropocene is a geological epoch dating from the commencement of significant human impact on Earth's geology and ecosystems, including anthropogenic climate change. Various start dates for the Anthropocene have been proposed, ranging from 12,000–15,000 years ago to as recently as the 1960s.",
    creator: {
      name: 'Waverley Crosby',
      avatar: 'https://api.adorable.io/avatars/132.png',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    },
    path: '5f6c689c2814719d2abcccfb-5f6c68dacb58aae02ee8d56e',
  },
  {
    id: '5f6c68e41786318beb0a79ff',
    name: 'Fossil Fuels',
    description:
      'A fossil fuel is a fuel formed by natural processes, such as anaerobic decomposition of buried dead organisms, containing organic molecules originating in ancient photosynthesis that release energy in combustion. The burning of fossil fuels raises serious environmental concerns, due to its release of carbon dioxide (CO2).',
    creator: {
      name: 'Nanette Miriam',
      avatar: 'https://api.adorable.io/avatars/310',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1546289917-e018604f4afa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    },
    path: '5f6c689c2814719d2abcccfb-5f6c68e41786318beb0a79ff',
  },
  {
    id: '5f6c68ed5b0ba6ea3a1d26f0',
    name: 'The Enlightenment',
    description:
      'The Age of Enlightenment was an intellectual and philosophical movement that dominated the world of ideas in Europe during the 17th to 19th centuries. The Enlightenment included a range of ideas centered on the sovereignty of reason and the evidence of the senses as the primary sources of knowledge.',
    creator: {
      name: 'Emily Emmett',
      avatar: 'https://api.adorable.io/avatars/114',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    },
    path: '5f6c689c2814719d2abcccfb-5f6c68ed5b0ba6ea3a1d26f0',
  },
  {
    id: '5f6c693e2aa702b99d5eb1fb',
    name: 'Introduction',
    description:
      "An introduction to Python, one of the world's most popular scripting languages. The introduction covers the history of Python, its uses and applications, and its main shortcomings.",
    creator: {
      name: 'Tamzin Berry',
      avatar: 'https://api.adorable.io/avatars/341',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80',
    },
    path:
      '5f6c689c2814719d2abcccfb-5f6c68cee60b191d841f0fa6-5f6c693e2aa702b99d5eb1fb',
  },
  {
    id: '5f6c696b49569c02af5e333c',
    name: 'Lists',
    description:
      "Lists are one of Python's four built-in data structures. They hold ordered collections of items. Each element or value that is inside of a list is called an item. Just as strings are defined as characters between quotes, lists are defined by having values between square brackets.",
    creator: {
      name: 'Tamzin Berry',
      avatar: 'https://api.adorable.io/avatars/341',
    },
    type: 'Space',
    extra: {
      image:
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80',
    },
    path:
      '5f6c689c2814719d2abcccfb-5f6c68cee60b191d841f0fa6-5f6c696b49569c02af5e333c',
  },
];

export default items;
