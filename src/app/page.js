"use client";
import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, List } from 'antd';
import Name from "./components/name";

const initialHierarchyData = {
    title: 'CEO',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+123456789',
    children: [
        {
            title: 'Head of staff/HR',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+987654321',
            children: [
                {
                    title: 'Team 1',
                    teamName: 'Team 1',
                    children: [
                        {
                            title: 'Team leader',
                            name: 'Alice Johnson',
                            email: 'alice.johnson@example.com',
                            phone: '+111111111'
                        },
                        {
                            title: 'Team member',
                            name: 'Bob Williams',
                            email: 'bob.williams@example.com',
                            phone: '+222222222'
                        }
                    ]
                },
                {
                    title: 'Team 2',
                    teamName: 'Team 2',
                    children: [
                        {
                            title: 'Team leader',
                            name: 'Eve Brown',
                            email: 'eve.brown@example.com',
                            phone: '+333333333'
                        },
                        {
                            title: 'Team member',
                            name: 'Charlie Davis',
                            email: 'charlie.davis@example.com',
                            phone: '+444444444'
                        }
                    ]
                }
            ]
        },
        {
            title: 'Head of engineering',
            name: 'Michael Wilson',
            email: 'michael.wilson@example.com',
            phone: '+555555555',
            children: [
                {
                    title: 'Team 2',
                    teamName: 'Engineering Team',
                    children: [
                        {
                            title: 'Team leader',
                            name: 'Grace Lee',
                            email: 'grace.lee@example.com',
                            phone: '+666666666'
                        },
                        {
                            title: 'Team member',
                            name: 'David Clark',
                            email: 'david.clark@example.com',
                            phone: '+777777777'
                        }
                    ]
                }
            ]
        },
        {
            title: 'Head of design',
            name: 'Olivia Garcia',
            email: 'olivia.garcia@example.com',
            phone: '+888888888',
            children: [
                {
                    title: 'Team 1',
                    teamName: 'Design Team',
                    children: [
                        {
                            title: 'Team leader',
                            name: 'Sophia Martinez',
                            email: 'sophia.martinez@example.com',
                            phone: '+999999999'
                        },
                        {
                            title: 'Team member',
                            name: 'Lucas Rodriguez',
                            email: 'lucas.rodriguez@example.com',
                            phone: '+1010101010'
                        }
                    ]
                }
            ]
        }
    ]
};

const MyHierarchyComponent = () => {
    const [hierarchyData, setHierarchyData] = useState(() => {
        const savedData = localStorage.getItem('hierarchyData');
        return savedData ? JSON.parse(savedData) : initialHierarchyData;
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        localStorage.setItem('hierarchyData', JSON.stringify(hierarchyData));
    }, [hierarchyData]);

    const handleDetailsUpdate = (updatedDetails) => {
        const updatedHierarchyData = updateDetailsInHierarchy(hierarchyData, updatedDetails);
        setHierarchyData(updatedHierarchyData);
    };

    const updateDetailsInHierarchy = (node, updatedDetails) => {
        if (node.title === updatedDetails.title && (node.name === updatedDetails.name || node.teamName === updatedDetails.teamName)) {
            return { ...node, ...updatedDetails };
        }
        if (node.children) {
            return {
                ...node,
                children: node.children.map(child => updateDetailsInHierarchy(child, updatedDetails))
            };
        }
        return node;
    };

    const renderHierarchy = (node) => {
        return (
            <li key={node.title + (node.name || node.teamName)}>
                <Name
                    text={node.title.includes("Team") ? node.teamName || node.title : node.title}
                    details={node}
                    onDetailsUpdate={handleDetailsUpdate}
                />
                {node.children && (
                    <ul>
                        {node.children.map(child => renderHierarchy(child))}
                    </ul>
                )}
            </li>
        );
    };

    const handleSearch = () => {
        setIsModalVisible(true);
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchQuery(value);
        if (value.trim()) {
            const results = searchInHierarchy(hierarchyData, value.trim().toLowerCase());
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const searchInHierarchy = (node, query) => {
		console.log(node.name)
        let results = [];
        if (
            node.name?.toLowerCase().includes(query) ||
            node.email?.toLowerCase().includes(query) ||
            node.phone?.toLowerCase().includes(query)
        ) {
            results.push(node);
        }
        if (node.children) {
            node.children.forEach(child => {
                results = results.concat(searchInHierarchy(child, query));
            });
        }
        return results;
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div>
            <h1>Company Hierarchy</h1>
            <Button type="primary" onClick={handleSearch}>Search</Button>
            <ul>
                {renderHierarchy(hierarchyData)}
            </ul>

            <Modal
                title="Search Employee"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    placeholder="Search by name, email or phone"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <List
                    itemLayout="horizontal"
                    dataSource={searchResults}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.name}
                                description={`${item.email} - ${item.phone}`}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default MyHierarchyComponent;
