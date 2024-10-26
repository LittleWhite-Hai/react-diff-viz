import "@arco-design/web-react/dist/css/arco.css";
import { IconDelete } from "@arco-design/web-react/icon";
import React, { useRef, useEffect, useState } from "react";
import {
  Form,
  AutoComplete,
  Input,
  Select,
  TreeSelect,
  Button,
  Checkbox,
  Switch,
  Radio,
  Cascader,
  Message,
  InputNumber,
  Rate,
  Slider,
  Upload,
  DatePicker,
  Modal,
} from "@arco-design/web-react";
const FormItem = Form.Item;

const programmingCascaderOptions = [
  {
    value: "frontend",
    label: "Frontend",
    children: [
      {
        value: "javascript",
        label: "JavaScript",
        children: [
          {
            value: "react",
            label: "React",
          },
          {
            value: "vue",
            label: "Vue",
          },
          {
            value: "angular",
            label: "Angular",
          },
        ],
      },
      {
        value: "css",
        label: "CSS",
        children: [
          {
            value: "sass",
            label: "Sass",
          },
          {
            value: "less",
            label: "Less",
          },
        ],
      },
    ],
  },
  {
    value: "backend",
    label: "Backend",
    children: [
      {
        value: "java",
        label: "Java",
        children: [
          {
            value: "spring",
            label: "Spring",
          },
          {
            value: "hibernate",
            label: "Hibernate",
          },
        ],
      },
      {
        value: "python",
        label: "Python",
        children: [
          {
            value: "django",
            label: "Django",
          },
          {
            value: "flask",
            label: "Flask",
          },
        ],
      },
      {
        value: "nodejs",
        label: "Node.js",
        children: [
          {
            value: "express",
            label: "Express",
          },
          {
            value: "koa",
            label: "Koa",
          },
        ],
      },
    ],
  },
  {
    value: "database",
    label: "Database",
    children: [
      {
        value: "sql",
        label: "SQL",
        children: [
          {
            value: "mysql",
            label: "MySQL",
          },
          {
            value: "postgresql",
            label: "PostgreSQL",
          },
        ],
      },
      {
        value: "nosql",
        label: "NoSQL",
        children: [
          {
            value: "mongodb",
            label: "MongoDB",
          },
          {
            value: "redis",
            label: "Redis",
          },
        ],
      },
    ],
  },
];

// 在Form组件中使用
<FormItem
  label="Tech Stack"
  field="tech_stack"
  rules={[{ type: "array", required: true, message: "please select" }]}
>
  <Cascader
    showSearch
    placeholder="please select"
    allowClear
    options={programmingCascaderOptions}
  />
</FormItem>;
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};
const noLabelLayout = {
  wrapperCol: {
    span: 17,
    offset: 7,
  },
};

export default function MyForm(props: any) {
  const { setFormData, initialValues } = props;
  const formRef = useRef<any>();
  const [values, setValues] = useState<any>(initialValues);
  useEffect(() => {
    setTimeout(() => {
      console.log("props: ", props);
      console.log("initialFormData: ", initialValues);
      formRef.current.setFieldsValue({
        ...initialValues,

        build_tool: "Rollup",
        create_time: [1727765900000, 2897165900000],
        other_tools: [
          {
            name: "git diff",
            description: "diff git commits, highlight text changes",
          },
          {
            name: "microdiff",
            description: "it's a fast tiny diff tool",
          },
        ],
      });
    }, 200);
  }, [initialValues]);

  const onValuesChange = (changeValue: any, values: any) => {
    setFormData(values);
    setValues(values);
    console.log("onValuesChange: ", changeValue, values);
  };

  return (
    <div style={{ display: "flex" }}>
      <Form
        ref={formRef}
        title="Edit Data"
        autoComplete="off"
        {...formItemLayout}
        size={"large"}
        labelAlign="left"
        onValuesChange={onValuesChange}
        scrollToFirstError
        style={{ width: "650px" }}
      >
        <FormItem
          label="Component Name"
          field="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="please enter your component name" />
        </FormItem>
        <FormItem
          label="Introduction"
          field="introduction"
          rules={[{ required: true }]}
        >
          <Input placeholder="please enter the introduction" />
        </FormItem>
        <FormItem label="Link" field="link" rules={[{ required: true }]}>
          <Input placeholder="please enter the link" />
        </FormItem>
        <FormItem label="Date" field="create_time" rules={[{ required: true }]}>
          <DatePicker.RangePicker showTime style={{ width: "100%" }} />
        </FormItem>
        <FormItem
          label="Package Size"
          field="package_size"
          rules={[{ type: "number", required: true }]}
        >
          <InputNumber placeholder="please enter" />
        </FormItem>
        <FormItem
          label="Dependency"
          required
          field="npm_dependencies"
          rules={[{ type: "array", minLength: 1 }]}
        >
          <Select
            mode="multiple"
            allowCreate
            placeholder="please select"
            options={["react", "lodash", "npm", "typescript"]}
          />
        </FormItem>
        <FormItem
          label="Support Array Diff"
          field="is_support_array"
          triggerPropName="checked"
          rules={[
            {
              type: "boolean",
              true: true,
              message: "react-diff-viz support array",
            },
          ]}
          wrapperCol={{ span: 1 }}
        >
          <Switch />
        </FormItem>
        <FormItem
          label="Stars"
          field="stars"
          rules={[{ required: true, type: "number" }]}
          wrapperCol={{ span: 1 }}
        >
          <Rate />
        </FormItem>

        <FormItem
          label="Build Tool"
          field="build_tool"
          required
          wrapperCol={{ span: 14 }}
        >
          <Radio.Group style={{ marginRight: "17px" }}>
            <Radio value="webpack">webpack</Radio>
            <Radio value="vite">vite</Radio>
            <Radio disabled value="parcel">
              cmake
            </Radio>
            <Radio value="rollup"> Rollup </Radio>
          </Radio.Group>
        </FormItem>

        <FormItem label="Tech Stack" field="tech_stack">
          <Cascader
            showSearch
            placeholder="please select"
            allowClear
            options={programmingCascaderOptions}
          />
        </FormItem>
        <Form.Item label="Other Tools" labelCol={{ span: 7 }}>
          <Form.List field="other_tools">
            {(fields, { add, remove, move }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key}>
                        <Form.Item>
                          <div style={{ display: "flex" }}>
                            <div>
                              <Form.Item
                                field={item.field + ".name"}
                                rules={[{ required: true }]}
                              >
                                <Input
                                  style={{ width: "410px" }}
                                  prefix={index + 1 + "."}
                                />
                              </Form.Item>
                              <Form.Item
                                field={item.field + ".description"}
                                rules={[{ required: true }]}
                                noStyle
                              >
                                <Input.TextArea style={{ width: "410px" }} />
                              </Form.Item>
                            </div>

                            <Button
                              icon={<IconDelete />}
                              shape="circle"
                              size="mini"
                              status="danger"
                              onClick={() => remove(index)}
                              style={{ marginLeft: "10px" }}
                            ></Button>
                          </div>
                        </Form.Item>
                      </div>
                    );
                  })}
                  <Form.Item wrapperCol={{ offset: 4 }}>
                    <Button
                      style={{ marginRight: "24px" }}
                      onClick={() => {
                        add({ name: "", description: "" });
                      }}
                      type="dashed"
                    >
                      Add Other Tool
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>

        {/* <Button
                    onClick={() => {
                        formRef.current.setFieldsValue(initialValues);
                    }}
                    type='primary'
                >
                    Reset
                </Button> */}
      </Form>
      <div
        style={{
          width: "550px",
          color: "var(--color-text-2)",
          textAlign: "left",
          marginLeft: "80px",
        }}
      >
        <p>Form data:</p>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  );
}
