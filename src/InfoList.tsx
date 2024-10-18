import React from "react";

interface InfoListProps {
  items: { label: string; value: string; path?: string }[];
}

const InfoList: React.FC<InfoListProps> = ({ items }) => {
  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const itemStyle: React.CSSProperties = {
    marginBottom: "5px",
    // width: "fit-content",
  };

  return (
    <div style={listStyle}>
      {items.map((item, index) => (
        <span>
          <span style={{ fontSize: "20px", fontWeight: "bolder" }}>·</span>{" "}
          <span key={index} style={itemStyle} data-path={item.path}>
            {item.label}: {item.value}
          </span>
        </span>
      ))}
    </div>
  );
};

export default InfoList;
