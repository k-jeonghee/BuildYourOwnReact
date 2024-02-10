const element = {
    type: 'h1',
    props: {
        title: 'foo',
        children: 'Hello',
    },
};

const node = document.createElement(element.type);
node['title'] = element.props.title;

const text = document.createTextNode('');
text['nodeValue'] = element.props.children; //props: {nodeValue: "hello"}.

const container = document.getElementById('root');
node.appendChild(text);
container.appendChild(node);
