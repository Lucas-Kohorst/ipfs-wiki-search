import React from "react";
import SearchBar from "material-ui-search-bar";
import wikiLogo from "./wikiLogo.png";

import { Wiki } from "./Wiki"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      wiki: null,
      title: null,
      border: null,
      errorMessage: null
    };
  }

  _search = (query) => {
    this.setState({
      wiki: null,
      title: null,
    });
    var queryArray = [];
    if (query.includes(" ")) {
      queryArray = query.split(" ");
      query = "";
      for (var i = 0; i < queryArray.length; i++) {
        queryArray[i] =
          queryArray[i][0].toUpperCase() + queryArray[i].slice(1).toLowerCase();
        if (i < queryArray.length - 1) {
          query += queryArray[i] + "_";
        } else {
          query += queryArray[i];
        }
      }
      console.log(query);
    }
    fetch("https://en.wikipedia-on-ipfs.org/wiki/" + query + ".html")
      .then(response => {
        if (response.ok) {
          return response
        } else {
          this.setState({
            border: "2px solid red",
            errorMessage: "Could not find " + query
          })
        }
      })
      .then(response => response.text())
      .then(data => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        var wiki = this._getElementByXpath(doc, "/html/body/div[1]/div/p[2]")
        console.log(wiki)
        this.setState({
          wiki: wiki,
          title: query
        });
      })
      .catch(error => console.error(error));
  }

  _getElementByXpath(doc, path) {
    return doc.evaluate(path, doc, null, XPathResult.STRING_TYPE, null)
      .stringValue;
  }

  render() {
    return (
      <React.Fragment>
        {this.state.wiki === null ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh"
            }}
          >
            <div style={{ padding: "2em" }}>
              <h1>Search the Distributed Wikipedia</h1>
              <img src={wikiLogo} alt="Wiki_Logo" style={{ height: "10rem" }} />
            </div>
            <SearchBar
              style={{ width: "50%", border: this.state.border }}
              value={this.state.value}
              onChange={newValue => this.setState({ value: newValue })}
              onRequestSearch={() => this._search(this.state.value)}
              onCancelSearch={() => this.setState({ value: "" })}
            />
            <h5 style={{ padding: 0, margin: 0, paddingTop: "1em" }}>{this.state.errorMessage}</h5>
            <h5>
              Running your own{" "}
              <a href="https://docs.ipfs.io/introduction/usage/">IPFS node</a>{" "}
              will speed up your search and distribute content
            </h5>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2em"
            }}
          >
            <h1>Search the Distributed Wikipedia</h1>
            <SearchBar
              style={{ width: "60%" }}
              value={this.state.value}
              onChange={newValue => this.setState({ value: newValue })}
              onRequestSearch={() => this._search(this.state.value)}
              onCancelSearch={() => this.setState({ value: null, border: null, errorMessage: null })}
            />
          </div>
        )}
        <div
          style={{
            textAlign: "left",
            padding: "2em"
          }}
        >
          <div>
            <Wiki
              title={this.state.title}
              about={this.state.wiki}
              link={
                "https://en.wikipedia-on-ipfs.org/wiki/" +
                this.state.title +
                ".html"
              }
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <a
            style={{ padding: "0.75em" }}
            href="https://en.wikipedia-on-ipfs.org/"
          >
            IPFS Wiki
          </a>
          <a
            style={{ padding: "0.75em" }}
            href="https://github.com/Lucas-Kohorst/ipfs-wiki"
          >
            Code
          </a>
          <a
            style={{ padding: "0.75em" }}
            href="mailto: kohorstlucas@gmail.com"
          >
            Contact
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export { Home };
