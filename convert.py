import re

if __name__ == "__main__":
    lines = []
    schema = open('schema.graphql', 'r').readlines()
    typeschema = open('typeschema.graphql', 'w')
    intype = False
    for line in schema:
        if intype:
            if line.startswith('}'):
                typeschema.write(line)
                intype = False
                continue
            if line.find('String') != -1 or line.find('Float') != -1 or line.find('Int') != -1 or line.find('Boolean') != -1:
                line = re.sub(r'(.*): (\[String!\]!|\[String\]!|\[String!\]|\[String\]|String!|String)', r'\1', line)
                line = re.sub(r'(.*): (\[Float!\]!|\[Float\]!|\[Float!\]|\[Float\]|Float!|Float)', r'\1', line)
                line = re.sub(r'(.*): (\[Int!\]!|\[Int\]!|\[Int!\]|\[Int\]|Int!|Int)', r'\1', line)
                line = re.sub(r'(.*): (\[Boolean!\]!|\[Boolean\]!|\[Boolean!\]|\[Boolean\]|Boolean!|Boolean)', r'\1', line)
            else:
                line = re.sub(r'(.*): (.*)', r'\1 {\n    ...\2\n  }', line)
                line = line.replace('!', '')
                line = line.replace('[', '')
                line = line.replace(']', '')                
            typeschema.write(line)
        else:
            if line.startswith('type') and line.find('implements') == -1:
                line = re.sub(r'type (.*) ', r'fragment \1 on \1 ', line)
                typeschema.write(line)
                intype = True
