
import "@arco-design/web-react/dist/css/arco.css";
import { IconArrowRise, IconArrowFall, IconDelete } from '@arco-design/web-react/icon';

import React, { useRef, useEffect, useState } from 'react';
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
    Space,
} from '@arco-design/web-react';
const FormItem = Form.Item;
const programmingCascaderOptions = [
    {
        value: 'frontend',
        label: '前端开发',
        children: [
            {
                value: 'javascript',
                label: 'JavaScript',
                children: [
                    {
                        value: 'react',
                        label: 'React',
                    },
                    {
                        value: 'vue',
                        label: 'Vue',
                    },
                    {
                        value: 'angular',
                        label: 'Angular',
                    },
                ],
            },
            {
                value: 'css',
                label: 'CSS',
                children: [
                    {
                        value: 'sass',
                        label: 'Sass',
                    },
                    {
                        value: 'less',
                        label: 'Less',
                    },
                ],
            },
        ],
    },
    {
        value: 'backend',
        label: '后端开发',
        children: [
            {
                value: 'java',
                label: 'Java',
                children: [
                    {
                        value: 'spring',
                        label: 'Spring',
                    },
                    {
                        value: 'hibernate',
                        label: 'Hibernate',
                    },
                ],
            },
            {
                value: 'python',
                label: 'Python',
                children: [
                    {
                        value: 'django',
                        label: 'Django',
                    },
                    {
                        value: 'flask',
                        label: 'Flask',
                    },
                ],
            },
            {
                value: 'nodejs',
                label: 'Node.js',
                children: [
                    {
                        value: 'express',
                        label: 'Express',
                    },
                    {
                        value: 'koa',
                        label: 'Koa',
                    },
                ],
            },
        ],
    },
    {
        value: 'database',
        label: '数据库',
        children: [
            {
                value: 'sql',
                label: 'SQL',
                children: [
                    {
                        value: 'mysql',
                        label: 'MySQL',
                    },
                    {
                        value: 'postgresql',
                        label: 'PostgreSQL',
                    },
                ],
            },
            {
                value: 'nosql',
                label: 'NoSQL',
                children: [
                    {
                        value: 'mongodb',
                        label: 'MongoDB',
                    },
                    {
                        value: 'redis',
                        label: 'Redis',
                    },
                ],
            },
        ],
    },
];

// 在Form组件中使用
<FormItem
    label='Tech Stack'
    field='tech_stack'
    rules={[{ type: 'array', required: true, message: '请选择技术栈' }]}
>
    <Cascader
        showSearch
        placeholder='请选择技术栈'
        allowClear
        options={programmingCascaderOptions}
    />
</FormItem>
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

function App(props) {
    const { setFormData, initialFormData } = props;
    const formRef = useRef<any>();
    const [size, setSize] = useState<any>('default');
    useEffect(() => {
        formRef.current.setFieldsValue({
            rate: 5,
        });
    }, []);

    const onValuesChange = (changeValue, values) => {
        setFormData(values);
        console.log('onValuesChange: ', changeValue, values);
    };

    return (
        <div style={{ maxWidth: 750 }}>
            <Form
                ref={formRef}
                title="Edit Data"
                autoComplete='off'
                {...formItemLayout}
                size={"large"}
                initialValues={initialFormData}
                onValuesChange={onValuesChange}
                scrollToFirstError
            >
                <FormItem label='Component Name' field='name' rules={[{ required: true }]}>
                    <Input placeholder='please enter your component name' />
                </FormItem>
                <FormItem label='Introduction' field='introduction' rules={[{ required: true }]}>
                    <Input placeholder='please enter the introduction' />
                </FormItem>
                <FormItem label='Date' field='date' rules={[{ required: true }]}>
                    <DatePicker showTime />
                </FormItem>
                <FormItem label='Package Size' field='package_size' rules={[{ type: 'number', required: true }]}>
                    <InputNumber placeholder='please enter' />
                </FormItem>
                <FormItem
                    label='Dependency'
                    required
                    field='dependency'
                    rules={[{ type: 'array', minLength: 1 }]}
                >
                    <Select
                        mode='multiple'
                        allowCreate
                        placeholder='please select'
                        options={['react', 'lodash', 'npm', 'typescript']}
                    />
                </FormItem>
                <FormItem label='Diff with other components' field='introduction' rules={[{ required: true }]} >
                    <Input placeholder='please enter the introduction' />
                </FormItem>
                <FormItem
                    label='Build Tool'
                    field='build_tool'
                    rules={[
                        {
                            validator: (value, callback) => {
                                if (value !== 'b') {
                                    callback('you can only choose b');
                                }
                            },
                        },
                    ]}
                >
                    <Radio.Group>
                        <Radio value='webpack'>webpack</Radio>
                        <Radio value='vite'>vite</Radio>
                        <Radio disabled value='parcel'>
                            cmake
                        </Radio>
                        <Radio value='rollup'> Rollup </Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem
                    label='Province'
                    field='province'
                    rules={[
                        {
                            type: 'array',
                            required: true,
                        },
                        {
                            type: 'array',
                            length: 4,
                        },
                    ]}
                >
                    <Cascader showSearch placeholder='please select' allowClear options={programmingCascaderOptions} />
                </FormItem>

                <FormItem label='Score' field='score' rules={[{ required: true, type: 'number' }]}>
                    <Rate />
                </FormItem>

                <FormItem
                    label='Support Array'
                    field='switch'
                    triggerPropName='checked'
                    rules={[{ type: 'boolean', true: true, message: "react-diff-viz support array" }]}
                >
                    <Switch />
                </FormItem>

                <FormItem
                    label='Slide'
                    field='slider'
                    rules={[
                        {
                            validator: (value, callback) => {
                                if (value < 50) {
                                    callback('must be greater than 50!');
                                }
                            },
                        },
                    ]}
                >
                    <Slider></Slider>
                </FormItem>
                <Form.Item
                    label='Upload'
                    field='upload'
                    triggerPropName='fileList'
                    initialValue={[
                        {
                            uid: '-1',
                            url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
                            name: '20200717',
                        },
                    ]}
                >
                    <Upload
                        listType='picture-card'
                        multiple
                        name='files'
                        action='/'
                        onPreview={(file: any) => {
                            Modal.info({
                                title: 'Preview',
                                content: (
                                    <img
                                        src={file.url || URL.createObjectURL(file.originFile)}
                                        style={{
                                            maxWidth: '100%',
                                        }}
                                    ></img>
                                ),
                            });
                        }}
                    />
                </Form.Item>
                <Form.List field='users'>
                    {(fields, { add, remove, move }) => {
                        return (
                            <div>
                                {fields.map((item, index) => {
                                    return (
                                        <div key={item.key}>
                                            <Form.Item label={'Tool ' + (index + 1)}>
                                                <div style={{ display: 'flex', }}>
                                                    <div>
                                                        <Form.Item
                                                            field={item.field + '.username'}
                                                            rules={[{ required: true }]}

                                                        >
                                                            <Input style={{ width: '410px' }} prefix="name" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            field={item.field + '.address'}
                                                            rules={[{ required: true }]}
                                                            noStyle
                                                        >
                                                            <Input.TextArea style={{ width: '410px' }} />
                                                        </Form.Item></div>

                                                    <Button
                                                        icon={<IconDelete />}
                                                        shape='circle'
                                                        size="mini"
                                                        status="danger"
                                                        onClick={() => remove(index)}
                                                        style={{ marginLeft: '10px' }}
                                                    ></Button>
                                                </div>
                                            </Form.Item>
                                        </div>
                                    );
                                })}
                                <Form.Item wrapperCol={{ offset: 5 }}>
                                    <Button
                                        onClick={() => {
                                            add();
                                        }}
                                    >
                                        Add Other Tool
                                    </Button>
                                </Form.Item>
                            </div>
                        );
                    }}
                </Form.List>
                <FormItem
                    {...noLabelLayout}
                    field='readme'
                    triggerPropName='checked'
                    rules={[{ type: 'boolean', true: true }]}
                >
                    <Checkbox>I have read the employee manual</Checkbox>
                </FormItem>
                <FormItem {...noLabelLayout}>
                    <Button
                        onClick={async () => {
                            if (formRef.current) {
                                try {
                                    await formRef.current.validate();
                                    Message.info('校验通过，提交成功！');
                                } catch (_) {
                                    console.log(formRef.current.getFieldsError());
                                    Message.error('校验失败，请检查字段！');
                                }
                            }
                        }}
                        type='primary'
                        style={{ marginRight: 24 }}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={() => {
                            formRef.current.resetFields();
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type='text'
                        onClick={() => {
                            Message.info(`fields: ${formRef.current.getTouchedFields().join(',')}`);
                        }}
                    >
                        Get touched fields
                    </Button>
                </FormItem>
            </Form>
        </div>
    );
}

export default App;
