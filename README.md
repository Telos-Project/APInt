# APInt

## 1 - Abstract

***Everything, Everywhere.***

APInt ("aey-pea-int"), short for API Interface, is a convention for specifying platform-agnostic
packages.

Applications which load specific utilities from APInt packages, themselves called APInts, into
specific environments are referred to as APInt portals. APInts, through portals, may be used as
libraries for programming languages, plugins for modular applications, and much more.

This mechanism serves as a lightweight standard by which to integrate and coordinate a massively
diverse array of utilities under unified and comphrehensive suites.

## 2 - Contents

### 2.1 - Conventions

#### 2.1.1 - Document Structure

The document structure of APInt files establishes a hierarchy of packages and utilities. Each
package and utility shall have an alias, and each utility shall reference a source file by string
file path or URL. Utilities can also have properties indicating their intended uses.

Furthermore, packages may use references to other APInt documents as sub-packages of themselves,
allowing APInts themselves to be distributed in their file composition.

#### 2.1.2 - Document Format

The standard APInt format is JSON based.

APInt documents are constructed out of recursively nested package objects, with a single package
object at the root of the document.

A package object may have the following fields: "packages", "utilities", and "properties".

The packages field contains an object which specifies descendant packages, with the key of each
field specifying the alias of a descandant, and the corresponding value specifying the descendant
itself. Said value may be another package object, or may be a string specifying the alias, file
path, or URL to another APInt file, the contents of which are to be integrated as the descendant
package.

The utilities field contains an object much like the one in the packages field, with each key
specifying the alias of a utility represented by the corresponding value, but said value is in the
form of a utility object.

A utility object may have a "source" field, and may have a "properties" field.

The source field may either be a string or a list of strings, the former specifying the file path,
URL, or alias for the source of the utility, and the latter specifying multiple such sources, in
order of preference, as backups.

The properties field contains an object of miscellaneous structure to be interpeted by portals, in
order to determine when, where, and how to utilize the utility to which it relates. The properties
field of package objects is the same in this regard, bubbling down to all of their descendant
packages and utilities, with descendant properties taking precedence over ancestor properties in
conflicts.

#### 2.1.3 - Property Protocols

Any standardized convention for interpreting utility properties in APInts is referred to as a
property protocol.

#### 2.1.4 - Element Paths

A hierarchical path of aliases for APInt elements (packages and utilities) may be constructed to
identify specific elements within a given APInt. Adjacent aliases of said path need not be
immediate parents and children, only ancestors and descendants.

Said paths may be concatenated together by periods, and for this reason, APInt element aliases
should not contain periods.

This mechanism helps to manage namespace conflicts.

### 2.2 - Examples

#### 2.2.1 - Example 1

    {
    	"packages": {
    		"math": {
    			"utilities": {
    				"vector": {
    					"source": "src/math/vector.js",
    					"properties": {
    						"language": "javascript",
    						"type": "library"
    					}
    				}
    			}
    		},
    		"graphics": "https://example.com/graphics.json"
    	},
    	"utilities": {
    		"init": {
    			"source": ["./init.py", "./init.js"]
    		}
    	},
    	"properties": {
    		"platform": "web"
    	}
    }